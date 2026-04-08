import { supabase } from "@/lib/supabase/client";
import { Database } from "@/types/database";

type UltrasoundImageRow =
  Database["public"]["Tables"]["ultrasound_images"]["Row"];
type UltrasoundImageInsert =
  Database["public"]["Tables"]["ultrasound_images"]["Insert"];

const ULTRASOUND_IMAGES_BUCKET = "ultrasound-images";

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
  extension: string,
): string {
  const normalizedExtension = extension ? extension.toLowerCase() : "jpg";
  return `${consultationId}/${imageId}.${normalizedExtension}`;
}

export async function getImageDimensions(
  file: File,
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
  consultationId: string,
): Promise<PreparedImageFile> {
  const imageId = crypto.randomUUID();
  const extension = getFileExtension(file) || "jpg";
  const storagePath = buildUltrasoundImageStoragePath(
    consultationId,
    imageId,
    extension,
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
): Promise<void> {
  const { error } = await supabase.storage
    .from(ULTRASOUND_IMAGES_BUCKET)
    .upload(preparedFile.storagePath, preparedFile.file, {
      cacheControl: "3600",
      upsert: false,
      contentType: preparedFile.mimeType,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }
}

export async function deleteUltrasoundImageFileFromStorage(
  storagePath: string,
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
  context: UploadUltrasoundImageContext,
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
): Promise<UltrasoundImageRow> {
  const preparedFile = await prepareUltrasoundImageFile(
    file,
    context.consultationId,
  );

  await uploadUltrasoundImageFileToStorage(preparedFile);

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
