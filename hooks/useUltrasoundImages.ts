"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createUltrasoundImage,
  isSupportedImageFile,
  type UploadUltrasoundImageContext,
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

  return useMemo(
    () => ({
      isUploading,
      error,
      uploadUltrasoundImages,
      clearUltrasoundImagesError: () => setError(null),
    }),
    [isUploading, error, uploadUltrasoundImages],
  );
}
