"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createUltrasoundImage,
  deleteAllUltrasoundImagesByConsultation,
  deleteSelectedUltrasoundImagesByIds,
  deleteSingleUltrasoundImage,
  fetchUltrasoundImagesByConsultation,
  isSupportedImageFile,
  type UploadProgressInfo,
  type UploadUltrasoundImageContext,
  type UltrasoundImageListItem,
} from "@/lib/queries/ultrasoundImages";
import { Database } from "@/types/database";

type UltrasoundImageRow =
  Database["public"]["Tables"]["ultrasound_images"]["Row"];

export interface UploadProgressState {
  isVisible: boolean;
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
  currentFileName: string | null;
  currentFileIndex: number;
  totalFiles: number;
}

export interface UploadUltrasoundImagesParams
  extends UploadUltrasoundImageContext {
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
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
    isVisible: false,
    percentage: 0,
    uploadedBytes: 0,
    totalBytes: 0,
    currentFileName: null,
    currentFileIndex: 0,
    totalFiles: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UltrasoundImageListItem[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const [isDeletingSelectedImages, setIsDeletingSelectedImages] =
    useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [deletingImageIds, setDeletingImageIds] = useState<string[]>([]);

  const uploadUltrasoundImages = useCallback(
    async (
      params: UploadUltrasoundImagesParams
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

      setUploadProgress({
        isVisible: true,
        percentage: 0,
        uploadedBytes: 0,
        totalBytes: 0,
        currentFileName: null,
        currentFileIndex: 0,
        totalFiles: 0,
      });

      const normalizedFiles = normalizeFiles(files);

      const totalFiles = normalizedFiles.length;
      const totalBytes = normalizedFiles.reduce(
        (sum, file) => sum + (file.size ?? 0),
        0
      );

      let uploadedBytesSoFar = 0;

      if (normalizedFiles.length === 0) {
        setIsUploading(false);
        throw new Error("No files were selected.");
      }

      const uploaded: UltrasoundImageRow[] = [];
      const failed: UploadUltrasoundImagesFailure[] = [];

      try {
        for (const [index, file] of normalizedFiles.entries()) {
          setUploadProgress((current) => ({
            ...current,
            isVisible: true,
            currentFileName: file.name,
            currentFileIndex: index + 1,
            totalFiles,
            totalBytes,
            uploadedBytes: uploadedBytesSoFar,
            percentage:
              totalBytes > 0
                ? Math.round((uploadedBytesSoFar / totalBytes) * 100)
                : 0,
          }));

          if (!isSupportedImageFile(file)) {
            failed.push({
              fileName: file.name,
              error: "Unsupported file type. Only image files are allowed.",
            });
            continue;
          }

          try {
            const insertedRow = await createUltrasoundImage(
              file,
              {
                clinicId,
                vetId,
                petId,
                consultationId,
                source,
                notes,
                sortOrder: startingSortOrder + index,
                metadata,
              },
              ({ bytesUploaded }: UploadProgressInfo) => {
                const totalUploadedBytes = uploadedBytesSoFar + bytesUploaded;

                setUploadProgress((current) => ({
                  ...current,
                  isVisible: true,
                  currentFileName: file.name,
                  currentFileIndex: index + 1,
                  totalFiles,
                  uploadedBytes: totalUploadedBytes,
                  totalBytes,
                  percentage:
                    totalBytes > 0
                      ? Math.min(
                          100,
                          Math.round((totalUploadedBytes / totalBytes) * 100)
                        )
                      : 0,
                }));
              }
            );

            uploaded.push(insertedRow);

            uploadedBytesSoFar += file.size ?? 0;

            setUploadProgress((current) => ({
              ...current,
              uploadedBytes: uploadedBytesSoFar,
              totalBytes,
              percentage:
                totalBytes > 0
                  ? Math.round((uploadedBytesSoFar / totalBytes) * 100)
                  : 100,
            }));
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
        setUploadProgress((current) => ({
          ...current,
          percentage: 100,
          uploadedBytes: current.totalBytes,
        }));

        setIsUploading(false);

        setTimeout(() => {
          setUploadProgress({
            isVisible: false,
            percentage: 0,
            uploadedBytes: 0,
            totalBytes: 0,
            currentFileName: null,
            currentFileIndex: 0,
            totalFiles: 0,
          });
        }, 400);
      }
    },
    []
  );

  // ============= FETCH ULTRASOUND IMAGES ==============
  const fetchUltrasoundImages = useCallback(
    async (consultationId: string): Promise<UltrasoundImageListItem[]> => {
      setIsLoadingImages(true);
      setFetchError(null);

      try {
        const fetchedImages = await fetchUltrasoundImagesByConsultation(
          consultationId
        );

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
    []
  );

  // ============= DELETE ULTRASOUND IMAGES ==============
  const deleteUltrasoundImage = useCallback(async (imageId: string) => {
    setError(null);
    setDeletingImageId(imageId);
    setDeletingImageIds([imageId]);

    try {
      await deleteSingleUltrasoundImage(imageId);

      setImages((currentImages) =>
        currentImages.filter((image) => image.id !== imageId)
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
      setDeletingImageIds([]);
    }
  }, []);

  const deleteSelectedUltrasoundImages = useCallback(async (imageIds: string[]) => {
    if (imageIds.length === 0) {
      return 0;
    }

    setError(null);
    setIsDeletingSelectedImages(true);
    setDeletingImageIds(imageIds);

    try {
      const deletedCount = await deleteSelectedUltrasoundImagesByIds(imageIds);

      setImages((currentImages) =>
        currentImages.filter((image) => !imageIds.includes(image.id))
      );

      return deletedCount;
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Unexpected delete selected error.";

      setError(message);
      throw deleteError;
    } finally {
      setIsDeletingSelectedImages(false);
      setDeletingImageIds([]);
    }
  }, []);

  const deleteAllUltrasoundImages = useCallback(
    async (consultationId: string) => {
      setError(null);
      setIsDeletingAllImages(true);
      setDeletingImageIds(images.map((image) => image.id));

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
        setDeletingImageIds([]);
      }
    },
    [images]
  );

  return useMemo(
    () => ({
      images,
      isLoadingImages,
      isUploading,
      isDeletingAllImages,
      isDeletingSelectedImages,
      deletingImageId,
      deletingImageIds,
      error,
      fetchError,
      uploadUltrasoundImages,
      fetchUltrasoundImages,
      deleteUltrasoundImage,
      deleteSelectedUltrasoundImages,
      deleteAllUltrasoundImages,
      uploadProgress,
      clearUltrasoundImagesError: () => setError(null),
    }),
    [
      images,
      isLoadingImages,
      isUploading,
      isDeletingAllImages,
      isDeletingSelectedImages,
      deletingImageId,
      deletingImageIds,
      error,
      fetchError,
      uploadUltrasoundImages,
      fetchUltrasoundImages,
      deleteUltrasoundImage,
      deleteSelectedUltrasoundImages,
      deleteAllUltrasoundImages,
      uploadProgress,
    ]
  );
}
