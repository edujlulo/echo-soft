"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createUltrasoundImage,
  deleteAllUltrasoundImagesByConsultation,
  deleteSingleUltrasoundImage,
  fetchUltrasoundImagesByConsultation,
  isSupportedImageFile,
  type UploadUltrasoundImageContext,
  type UltrasoundImageListItem,
} from "@/lib/queries/ultrasoundImages";
import { Database } from "@/types/database";

type UltrasoundImageRow =
  Database["public"]["Tables"]["ultrasound_images"]["Row"];

export interface UploadUltrasoundImagesParams extends UploadUltrasoundImageContext {
  files: File[] | FileList;
  startingSortOrder?: number;
}

export interface UploadUltrasoundImagesFailure {
  fileName: string;
  error: string;
}

export interface UploadUltrasoundImagesResult {
  uploaded: UltrasoundImageRow[];
  failed: UploadUltrasoundImagesFailure[];
}

function normalizeFiles(files: File[] | FileList): File[] {
  return Array.isArray(files) ? files : Array.from(files);
}

export function useUltrasoundImages() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UltrasoundImageListItem[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const uploadUltrasoundImages = useCallback(
    async (
      params: UploadUltrasoundImagesParams,
    ): Promise<UploadUltrasoundImagesResult> => {
      const {
        files,
        startingSortOrder = 0,
        clinicId,
        vetId,
        petId,
        consultationId,
        source,
        notes,
        metadata,
      } = params;

      setIsUploading(true);
      setError(null);

      const normalizedFiles = normalizeFiles(files);

      if (normalizedFiles.length === 0) {
        setIsUploading(false);
        throw new Error("No files were selected.");
      }

      const uploaded: UltrasoundImageRow[] = [];
      const failed: UploadUltrasoundImagesFailure[] = [];

      try {
        for (const [index, file] of normalizedFiles.entries()) {
          if (!isSupportedImageFile(file)) {
            failed.push({
              fileName: file.name,
              error: "Unsupported file type. Only image files are allowed.",
            });
            continue;
          }

          try {
            const insertedRow = await createUltrasoundImage(file, {
              clinicId,
              vetId,
              petId,
              consultationId,
              source,
              notes,
              sortOrder: startingSortOrder + index,
              metadata,
            });

            uploaded.push(insertedRow);
          } catch (uploadError) {
            const message =
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown upload error.";

            failed.push({
              fileName: file.name,
              error: message,
            });
          }
        }

        if (uploaded.length === 0 && failed.length > 0) {
          const firstError = failed[0]?.error ?? "All uploads failed.";
          setError(firstError);
        }

        return { uploaded, failed };
      } catch (unexpectedError) {
        const message =
          unexpectedError instanceof Error
            ? unexpectedError.message
            : "Unexpected upload error.";

        setError(message);
        throw unexpectedError;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  // ============= FETCH ULTRASOUND IMAGES ==============
  const fetchUltrasoundImages = useCallback(
    async (consultationId: string): Promise<UltrasoundImageListItem[]> => {
      setIsLoadingImages(true);
      setFetchError(null);

      try {
        const fetchedImages =
          await fetchUltrasoundImagesByConsultation(consultationId);

        setImages(fetchedImages);
        return fetchedImages;
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Unexpected fetch error.";

        setFetchError(message);
        throw fetchError;
      } finally {
        setIsLoadingImages(false);
      }
    },
    [],
  );

  // ============= DELETE ULTRASOUND IMAGES ==============
  const deleteUltrasoundImage = useCallback(async (imageId: string) => {
    setError(null);
    setDeletingImageId(imageId);

    try {
      await deleteSingleUltrasoundImage(imageId);

      setImages((currentImages) =>
        currentImages.filter((image) => image.id !== imageId),
      );
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unexpected delete error.";

      setError(message);
      throw deleteError;
    } finally {
      setDeletingImageId(null);
    }
  }, []);

  const deleteAllUltrasoundImages = useCallback(
    async (consultationId: string) => {
      setError(null);
      setIsDeletingAllImages(true);

      try {
        await deleteAllUltrasoundImagesByConsultation(consultationId);
        setImages([]);
      } catch (deleteError) {
        const message =
          deleteError instanceof Error
            ? deleteError.message
            : "Unexpected delete all error.";

        setError(message);
        throw deleteError;
      } finally {
        setIsDeletingAllImages(false);
      }
    },
    [],
  );

  return useMemo(
    () => ({
      images,
      isLoadingImages,
      isUploading,
      isDeletingAllImages,
      deletingImageId,
      error,
      fetchError,
      uploadUltrasoundImages,
      fetchUltrasoundImages,
      deleteUltrasoundImage,
      deleteAllUltrasoundImages,
      clearUltrasoundImagesError: () => setError(null),
    }),
    [
      images,
      isLoadingImages,
      isUploading,
      isDeletingAllImages,
      deletingImageId,
      error,
      fetchError,
      uploadUltrasoundImages,
      fetchUltrasoundImages,
      deleteUltrasoundImage,
      deleteAllUltrasoundImages,
    ],
  );
}
