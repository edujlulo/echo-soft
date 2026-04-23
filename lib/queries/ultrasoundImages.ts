import { supabase } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import * as tus from "tus-js-client";

type UltrasoundImageRow =
  Database["public"]["Tables"]["ultrasound_images"]["Row"];
type UltrasoundImageInsert =
  Database["public"]["Tables"]["ultrasound_images"]["Insert"];

const ULTRASOUND_IMAGES_BUCKET = "ultrasound-images";

export const MAX_ULTRASOUND_IMAGES_PER_CONSULTATION = 90;

function getSupabaseStorageTusEndpoint(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }

  const url = new URL(supabaseUrl);
  const hostnameParts = url.hostname.split(".");

  const projectId = hostnameParts[0];

  if (!projectId) {
    throw new Error("Could not determine Supabase project ID.");
  }

  return `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`;
}

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
]);

export interface UploadUltrasoundImageContext {
  clinicId: UltrasoundImageInsert["clinic_id"];
  vetId: UltrasoundImageInsert["vet_id"];
  petId: UltrasoundImageInsert["pet_id"];
  consultationId: UltrasoundImageInsert["consultation_id"];
  uploadedByUserId?: UltrasoundImageInsert["uploaded_by_user_id"];
  source?: UltrasoundImageInsert["source"];
  notes?: UltrasoundImageInsert["notes"];
  sortOrder?: UltrasoundImageInsert["sort_order"];
  metadata?: UltrasoundImageInsert["metadata"];
}

export interface PreparedImageFile {
  file: File;
  imageId: UltrasoundImageRow["id"];
  storagePath: UltrasoundImageRow["storage_path"];
  fileName: NonNullable<UltrasoundImageRow["file_name"]>;
  mimeType: NonNullable<UltrasoundImageRow["mime_type"]>;
  fileSizeBytes: number;
  width: UltrasoundImageRow["width"];
  height: UltrasoundImageRow["height"];
  extension: string;
}

export interface UploadProgressInfo {
  bytesUploaded: number;
  bytesTotal: number;
}

export interface UltrasoundImageListItem {
  id: UltrasoundImageRow["id"];
  src: string;
  alt: string;
  fileName: string | null;
  storagePath: string;
  width: number | null;
  height: number | null;
  uploadedAt: string | null;
  sortOrder: number | null;
}

function sanitizeFileName(fileName: string): string {
  return fileName.trim().replace(/\s+/g, " ");
}

function getFileExtension(file: File): string {
  const fileName = file.name ?? "";
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return "";
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase();
}

export function isSupportedImageFile(file: File): boolean {
  const mimeType = file.type?.toLowerCase() ?? "";
  const extension = getFileExtension(file);

  if (mimeType && ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
    return true;
  }

  return ["jpg", "jpeg", "png", "webp", "heic"].includes(extension);
}

export function buildUltrasoundImageStoragePath(
  consultationId: string,
  imageId: string,
  extension: string
): string {
  const normalizedExtension = extension ? extension.toLowerCase() : "jpg";
  return `${consultationId}/${imageId}.${normalizedExtension}`;
}

export async function getImageDimensions(
  file: File
): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth || null,
        height: image.naturalHeight || null,
      });
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      resolve({ width: null, height: null });
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;
  });
}

export async function prepareUltrasoundImageFile(
  file: File,
  consultationId: string
): Promise<PreparedImageFile> {
  const imageId = crypto.randomUUID();
  const extension = getFileExtension(file) || "jpg";
  const storagePath = buildUltrasoundImageStoragePath(
    consultationId,
    imageId,
    extension
  );
  const dimensions = await getImageDimensions(file);

  return {
    file,
    imageId,
    storagePath,
    fileName: sanitizeFileName(file.name || `${imageId}.${extension}`),
    mimeType: file.type,
    fileSizeBytes: file.size ?? 0,
    width: dimensions.width,
    height: dimensions.height,
    extension,
  };
}

export async function uploadUltrasoundImageFileToStorage(
  preparedFile: PreparedImageFile,
  onProgress?: (progress: UploadProgressInfo) => void
): Promise<void> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(`Failed to get Supabase session: ${sessionError.message}`);
  }

  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("Missing Supabase access token.");
  }

  const endpoint = getSupabaseStorageTusEndpoint();

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(preparedFile.file, {
      endpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${accessToken}`,
        "x-upsert": "false",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName: ULTRASOUND_IMAGES_BUCKET,
        objectName: preparedFile.storagePath,
        contentType: preparedFile.mimeType || "application/octet-stream",
        cacheControl: "3600",
      },
      onError(error) {
        reject(new Error(`Storage upload failed: ${error.message}`));
      },
      onProgress(bytesUploaded, bytesTotal) {
        onProgress?.({
          bytesUploaded,
          bytesTotal,
        });
      },
      onSuccess() {
        resolve();
      },
    });

    upload
      .findPreviousUploads()
      .then((previousUploads) => {
        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        upload.start();
      })
      .catch((error) => {
        reject(
          new Error(
            error instanceof Error
              ? error.message
              : "Failed to initialize resumable upload."
          )
        );
      });
  });
}

export async function deleteUltrasoundImageFileFromStorage(
  storagePath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(ULTRASOUND_IMAGES_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Storage cleanup failed: ${error.message}`);
  }
}

export async function insertUltrasoundImageRow(
  preparedFile: PreparedImageFile,
  context: UploadUltrasoundImageContext
): Promise<UltrasoundImageRow> {
  const metadataFromContext: Record<string, unknown> =
    context.metadata &&
    typeof context.metadata === "object" &&
    !Array.isArray(context.metadata)
      ? (context.metadata as Record<string, unknown>)
      : {};

  const rowToInsert: UltrasoundImageInsert = {
    id: preparedFile.imageId,
    clinic_id: context.clinicId,
    vet_id: context.vetId,
    pet_id: context.petId,
    consultation_id: context.consultationId,
    bucket_name: ULTRASOUND_IMAGES_BUCKET,
    storage_path: preparedFile.storagePath,
    file_name: preparedFile.fileName,
    mime_type: preparedFile.mimeType,
    file_size_bytes: preparedFile.fileSizeBytes,
    width: preparedFile.width,
    height: preparedFile.height,
    sort_order: context.sortOrder ?? null,
    notes: context.notes ?? null,
    uploaded_by_user_id: context.uploadedByUserId ?? null,
    metadata: {
      originalFileName: preparedFile.file.name,
      extension: preparedFile.extension,
      ...metadataFromContext,
    } as UltrasoundImageInsert["metadata"],
    source: context.source ?? "folder_upload",
  };

  const { data, error } = await supabase
    .from("ultrasound_images")
    .insert(rowToInsert)
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return data as UltrasoundImageRow;
}

export async function createUltrasoundImage(
  file: File,
  context: UploadUltrasoundImageContext,
  onProgress?: (progress: UploadProgressInfo) => void
): Promise<UltrasoundImageRow> {
  const preparedFile = await prepareUltrasoundImageFile(
    file,
    context.consultationId
  );

  await uploadUltrasoundImageFileToStorage(preparedFile, onProgress);

  try {
    return await insertUltrasoundImageRow(preparedFile, context);
  } catch (error) {
    try {
      await deleteUltrasoundImageFileFromStorage(preparedFile.storagePath);
    } catch (cleanupError) {
      console.error("Failed to clean up orphaned storage file:", cleanupError);
    }

    throw error;
  }
}

// ========= HELPERS AND FUNCTIONS FOR DELETE IMAGES ==========
function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

export async function fetchUltrasoundImageRowsByConsultation(
  consultationId: string
): Promise<UltrasoundImageRow[]> {
  const { data, error } = await supabase
    .from("ultrasound_images")
    .select("*")
    .eq("consultation_id", consultationId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("uploaded_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch ultrasound image rows: ${error.message}`);
  }

  return (data ?? []) as UltrasoundImageRow[];
}

export async function countUltrasoundImagesByConsultation(
  consultationId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("ultrasound_images")
    .select("id", { count: "exact", head: true })
    .eq("consultation_id", consultationId)
    .is("deleted_at", null);

  if (error) {
    throw new Error(`Failed to count ultrasound images: ${error.message}`);
  }

  return count ?? 0;
}

export async function fetchUltrasoundImageRowById(
  imageId: string
): Promise<UltrasoundImageRow | null> {
  const { data, error } = await supabase
    .from("ultrasound_images")
    .select("*")
    .eq("id", imageId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch ultrasound image row: ${error.message}`);
  }

  return (data as UltrasoundImageRow | null) ?? null;
}

export async function deleteUltrasoundImageRowsByIds(
  imageIds: string[]
): Promise<void> {
  if (imageIds.length === 0) return;

  const { error } = await supabase
    .from("ultrasound_images")
    .delete()
    .in("id", imageIds);

  if (error) {
    throw new Error(`Database delete failed: ${error.message}`);
  }
}

export async function deleteUltrasoundImageFilesFromStorage(
  storagePaths: string[]
): Promise<void> {
  if (storagePaths.length === 0) return;

  const pathChunks = chunkArray(storagePaths, 100);

  for (const chunk of pathChunks) {
    const { error } = await supabase.storage
      .from(ULTRASOUND_IMAGES_BUCKET)
      .remove(chunk);

    if (error) {
      throw new Error(`Storage cleanup failed: ${error.message}`);
    }
  }
}

export async function deleteSingleUltrasoundImage(
  imageId: string
): Promise<void> {
  const row = await fetchUltrasoundImageRowById(imageId);

  if (!row) {
    return;
  }

  await deleteUltrasoundImageFilesFromStorage([row.storage_path]);
  await deleteUltrasoundImageRowsByIds([row.id]);
}

export async function deleteAllUltrasoundImagesByConsultation(
  consultationId: string
): Promise<number> {
  const rows = await fetchUltrasoundImageRowsByConsultation(consultationId);

  if (rows.length === 0) {
    return 0;
  }

  const imageIds = rows.map((row) => row.id);
  const storagePaths = rows.map((row) => row.storage_path);

  await deleteUltrasoundImageFilesFromStorage(storagePaths);
  await deleteUltrasoundImageRowsByIds(imageIds);

  return rows.length;
}

// ============= FETCH ULTRASOUND IMAGES BY CONSULTATION ==============
export async function fetchUltrasoundImagesByConsultation(
  consultationId: string
): Promise<UltrasoundImageListItem[]> {
  const { data: rows, error } = await supabase
    .from("ultrasound_images")
    .select("*")
    .eq("consultation_id", consultationId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("uploaded_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch ultrasound images: ${error.message}`);
  }

  if (!rows || rows.length === 0) {
    return [];
  }

  const paths = rows.map((row) => row.storage_path);

  return rows.map((row) => {
    const { data } = supabase.storage
      .from(ULTRASOUND_IMAGES_BUCKET)
      .getPublicUrl(row.storage_path);

    return {
      id: row.id,
      src: data.publicUrl,
      alt: row.file_name ?? "Ultrasound image",
      fileName: row.file_name,
      storagePath: row.storage_path,
      width: row.width,
      height: row.height,
      uploadedAt: row.uploaded_at,
      sortOrder: row.sort_order,
    };
  });
}
