"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Button from "@/components/Button";
import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useConsultationStore } from "@/context/consultationStore";
import AppDialog from "@/components/AppDialog";
import { ultrasoundUploadManager } from "@/lib/uploads/ultrasoundUploadManager";
import { useUltrasoundUploadManager } from "@/components/providers/UltrasoundUploadManagerProvider";
import {
  countUltrasoundImagesByConsultation,
  isUltrasoundImageWithinSizeLimit,
  MAX_ULTRASOUND_IMAGES_PER_CONSULTATION,
  MAX_ULTRASOUND_IMAGE_SIZE_MB,
} from "@/lib/queries/ultrasoundImages";
import { useTranslations } from "next-intl";
import { compressImageForUltrasoundUpload } from "@/lib/images/compressImage";

interface Props {
  onUploadComplete?: () => Promise<void> | void;
  onDeleteSelectedClick: () => void;
  deleteAllUltrasoundImages: (consultationId: string) => Promise<number | void>;
  isDeletingAllImages: boolean;
  isDeletingSelectedImages: boolean;
  hasImages: boolean;
  selectedImageCount: number;
  isSelectionActionsDisabled: boolean;
  currentImageCount: number;
}

interface PendingSizeLimitUpload {
  validFiles: File[];
  oversizedFiles: File[];
}

export default function UltrasoundImagesActions({
  onUploadComplete,
  onDeleteSelectedClick,
  deleteAllUltrasoundImages,
  isDeletingAllImages,
  isDeletingSelectedImages,
  hasImages,
  selectedImageCount,
  isSelectionActionsDisabled,
  currentImageCount,
}: Props) {
  const t = useTranslations("UltrasoundImagesTab");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [uploadLimitMessage, setUploadLimitMessage] = useState<string | null>(
    null
  );
  const [pendingSizeLimitUpload, setPendingSizeLimitUpload] =
    useState<PendingSizeLimitUpload | null>(null);

  const { state: uploadManagerState } = useUltrasoundUploadManager();

  const isUploading = uploadManagerState.items.some(
    (item) => item.status === "queued" || item.status === "uploading"
  );
  const remainingImageSlots = Math.max(
    0,
    MAX_ULTRASOUND_IMAGES_PER_CONSULTATION - currentImageCount
  );
  const hasReachedImageLimit = remainingImageSlots === 0;
  const isAnyDeleteInProgress =
    isDeletingAllImages ||
    isDeletingSelectedImages ||
    isSelectionActionsDisabled;

  const clinicId = useClinicStore((s) => s.activeClinic?.clinic_id);
  const vetId = useActiveVetStore((s) => s.activeVet?.vet_id);
  const petId = useSelectedPetStore((s) => s.selectedPet?.pet_id);
  const consultationId = useConsultationStore(
    (s) => s.selectedConsultation?.consultation_id
  );

  function handleOpenFilePicker() {
    if (hasReachedImageLimit) {
      setUploadLimitMessage(
        t("imageLimitReached", {
          maxImages: MAX_ULTRASOUND_IMAGES_PER_CONSULTATION,
        })
      );
      return;
    }

    setUploadLimitMessage(null);
    fileInputRef.current?.click();
  }

  function handleOpenDeleteAllDialog() {
    setIsDeleteAllDialogOpen(true);
  }

  async function handleDeleteAllImages() {
    if (!consultationId) {
      console.error("Missing consultation ID for ultrasound image deletion.");
      return;
    }

    try {
      await deleteAllUltrasoundImages(consultationId);
      await onUploadComplete?.();
      setIsDeleteAllDialogOpen(false);
    } catch (error) {
      console.error("Delete all ultrasound images error:", error);
    }
  }

  async function enqueueValidUltrasoundFiles(files: File[]) {
    if (!clinicId || !vetId || !petId || !consultationId) {
      console.error("Missing required IDs for ultrasound image upload.");
      return;
    }

    const compressedFiles = await compressUltrasoundFiles(files);

    await ultrasoundUploadManager.enqueueUltrasoundUploads({
      files: compressedFiles,
      clinicId,
      vetId,
      petId,
      consultationId,
      onUploadComplete,
    });
  }

  async function compressUltrasoundFiles(files: File[]): Promise<File[]> {
    return Promise.all(
      files.map((file) => compressImageForUltrasoundUpload(file))
    );
  }

  async function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];

    event.target.value = "";

    if (selectedFiles.length === 0) return;

    if (!clinicId || !vetId || !petId || !consultationId) {
      console.error("Missing required IDs for ultrasound image upload.");
      return;
    }

    try {
      setUploadLimitMessage(null);
      setPendingSizeLimitUpload(null);

      const validSizeFiles = selectedFiles.filter(
        isUltrasoundImageWithinSizeLimit
      );
      const oversizedFiles = selectedFiles.filter(
        (file) => !isUltrasoundImageWithinSizeLimit(file)
      );

      if (validSizeFiles.length === 0) {
        setUploadLimitMessage(
          t("allImagesExceedSizeLimit", {
            maxSizeMb: MAX_ULTRASOUND_IMAGE_SIZE_MB,
          })
        );
        return;
      }

      const currentStoredImageCount = await countUltrasoundImagesByConsultation(
        consultationId
      );

      const remainingSlots = Math.max(
        0,
        MAX_ULTRASOUND_IMAGES_PER_CONSULTATION - currentStoredImageCount
      );

      if (validSizeFiles.length > remainingSlots) {
        setUploadLimitMessage(
          remainingSlots === 0
            ? t("imageLimitReached", {
                maxImages: MAX_ULTRASOUND_IMAGES_PER_CONSULTATION,
              })
            : t("remainingUploadLimit", {
                currentImageCount: currentStoredImageCount,
                remainingSlots,
              })
        );
        return;
      }

      if (oversizedFiles.length > 0) {
        setPendingSizeLimitUpload({
          validFiles: validSizeFiles,
          oversizedFiles,
        });
        return;
      }

      await enqueueValidUltrasoundFiles(validSizeFiles);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadLimitMessage(t("imageLimitValidationError"));
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-start">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      <Button
        type="button"
        onClick={handleOpenFilePicker}
        disabled={isUploading || isAnyDeleteInProgress}
        className={isUploading ? "bg-blue-300 border-blue-500!" : ""}
      >
        {isUploading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>{t("uploadingImages")}</span>
          </span>
        ) : (
          t("copyImagesFromFolder")
        )}
      </Button>

      <Button
        type="button"
        onClick={onDeleteSelectedClick}
        disabled={isUploading || isAnyDeleteInProgress}
        className={isDeletingSelectedImages ? "bg-red-300 border-red-500!" : ""}
      >
        {isDeletingSelectedImages ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>{t("deletingImages")}</span>
          </span>
        ) : selectedImageCount === 1 ? (
          t("deleteSelectedImage")
        ) : (
          t("deleteSelectedImages")
        )}
      </Button>

      <Button
        type="button"
        onClick={handleOpenDeleteAllDialog}
        disabled={isAnyDeleteInProgress || isUploading || !hasImages}
        className={isDeletingAllImages ? "bg-red-300 border-red-500!" : ""}
      >
        {isDeletingAllImages ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>{t("deletingImages")}</span>
          </span>
        ) : (
          t("deleteAllImages")
        )}
      </Button>

      <AppDialog
        isOpen={isDeleteAllDialogOpen}
        onClose={() => setIsDeleteAllDialogOpen(false)}
        navbarTitle={t("confirmDeleteTitle")}
        title={t("deleteAllTitle")}
        description={
          <>
            <p>{t("deleteAllQuestion")}</p>
            <p className="mt-2 font-semibold text-red-700">
              {t("irreversibleWarning")}
            </p>
          </>
        }
        confirmLabel={t("deleteAll")}
        confirmLoadingLabel={t("deletingImages")}
        cancelLabel={t("cancel")}
        variant="danger"
        isLoading={isDeletingAllImages}
        disableClose={isDeletingAllImages}
        onConfirm={handleDeleteAllImages}
      />

      <AppDialog
        isOpen={uploadLimitMessage !== null}
        onClose={() => setUploadLimitMessage(null)}
        navbarTitle={t("imageLimitTitle")}
        title={t("cannotUploadImagesTitle")}
        description={<p>{uploadLimitMessage}</p>}
        confirmLabel={t("understood")}
        showCancelButton={false}
        onConfirm={() => setUploadLimitMessage(null)}
      />

      <AppDialog
        isOpen={pendingSizeLimitUpload !== null}
        onClose={() => setPendingSizeLimitUpload(null)}
        navbarTitle={t("imageSizeLimitTitle")}
        title={t("someImagesExceedSizeLimitTitle")}
        description={
          <div className="space-y-3">
            <p>
              {t("someImagesExceedSizeLimitDescription", {
                oversizedCount:
                  pendingSizeLimitUpload?.oversizedFiles.length ?? 0,
                maxSizeMb: MAX_ULTRASOUND_IMAGE_SIZE_MB,
                validCount: pendingSizeLimitUpload?.validFiles.length ?? 0,
              })}
            </p>

            <p className="font-semibold text-gray-700">
              {t("continueWithValidImagesQuestion")}
            </p>
          </div>
        }
        confirmLabel={t("uploadValidImages", {
          count: pendingSizeLimitUpload?.validFiles.length ?? 0,
        })}
        cancelLabel={t("cancelUpload")}
        onConfirm={async () => {
          const filesToUpload = pendingSizeLimitUpload?.validFiles ?? [];

          setPendingSizeLimitUpload(null);

          if (filesToUpload.length === 0) return;

          try {
            await enqueueValidUltrasoundFiles(filesToUpload);
          } catch (error) {
            console.error("Upload error:", error);
            setUploadLimitMessage(t("imageLimitValidationError"));
          }
        }}
        onCancel={() => setPendingSizeLimitUpload(null)}
      />
    </div>
  );
}
