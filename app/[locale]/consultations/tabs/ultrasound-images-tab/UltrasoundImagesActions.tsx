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
  MAX_ULTRASOUND_IMAGES_PER_CONSULTATION,
} from "@/lib/queries/ultrasoundImages";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [uploadLimitMessage, setUploadLimitMessage] = useState<string | null>(
    null,
  );

  const { state: uploadManagerState } = useUltrasoundUploadManager();

  const isUploading = uploadManagerState.items.some(
    (item) => item.status === "queued" || item.status === "uploading",
  );
  const remainingImageSlots = Math.max(
    0,
    MAX_ULTRASOUND_IMAGES_PER_CONSULTATION - currentImageCount,
  );
  const hasReachedImageLimit = remainingImageSlots === 0;
  const isAnyDeleteInProgress =
    isDeletingAllImages || isDeletingSelectedImages || isSelectionActionsDisabled;

  const clinicId = useClinicStore((s) => s.activeClinic?.clinic_id);
  const vetId = useActiveVetStore((s) => s.activeVet?.vet_id);
  const petId = useSelectedPetStore((s) => s.selectedPet?.pet_id);
  const consultationId = useConsultationStore(
    (s) => s.selectedConsultation?.consultation_id,
  );

  function handleOpenFilePicker() {
    if (hasReachedImageLimit) {
      setUploadLimitMessage(
        `Esta consulta ya tiene el límite de ${MAX_ULTRASOUND_IMAGES_PER_CONSULTATION} imágenes.`,
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

  async function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];

    if (selectedFiles.length === 0) return;

    if (!clinicId || !vetId || !petId || !consultationId) {
      console.error("Missing required IDs for ultrasound image upload.");
      event.target.value = "";
      return;
    }

    try {
      setUploadLimitMessage(null);

      const currentStoredImageCount =
        await countUltrasoundImagesByConsultation(consultationId);
      const remainingSlots = Math.max(
        0,
        MAX_ULTRASOUND_IMAGES_PER_CONSULTATION - currentStoredImageCount,
      );

      if (selectedFiles.length > remainingSlots) {
        setUploadLimitMessage(
          remainingSlots === 0
            ? `Esta consulta ya tiene el límite de ${MAX_ULTRASOUND_IMAGES_PER_CONSULTATION} imágenes.`
            : `Esta consulta tiene ${currentStoredImageCount} imágenes. Sólo puedes subir ${remainingSlots} más.`,
        );
        event.target.value = "";
        return;
      }

      await ultrasoundUploadManager.enqueueUltrasoundUploads({
        files: selectedFiles,
        clinicId,
        vetId,
        petId,
        consultationId,
        onUploadComplete,
      });

      event.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setUploadLimitMessage(
        "No se pudo validar el límite de imágenes. Intenta nuevamente.",
      );
      event.target.value = "";
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
            <span>Subiendo imágenes...</span>
          </span>
        ) : (
          "Copiar imágenes desde la carpeta"
        )}
      </Button>

      <Button
        type="button"
        onClick={onDeleteSelectedClick}
        disabled={isUploading || isAnyDeleteInProgress}
        className={
          isDeletingSelectedImages ? "bg-red-300 border-red-500!" : ""
        }
      >
        {isDeletingSelectedImages ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Borrando imágenes...</span>
          </span>
        ) : selectedImageCount === 1 ? (
          "Borrar imagen seleccionada"
        ) : (
          "Borrar imágenes seleccionadas"
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
            <span>Borrando imágenes...</span>
          </span>
        ) : (
          "Borrar todas las imágenes"
        )}
      </Button>

      <AppDialog
        isOpen={isDeleteAllDialogOpen}
        onClose={() => setIsDeleteAllDialogOpen(false)}
        navbarTitle="Confirmar eliminación"
        title="Eliminar todas las imágenes de esta consulta"
        description={
          <>
            <p>
              ¿Estás seguro de que deseas eliminar todas las imágenes de esta
              consulta?
            </p>
            <p className="mt-2 font-semibold text-red-700">
              Esta acción no se puede deshacer.
            </p>
          </>
        }
        confirmLabel="Eliminar todo"
        confirmLoadingLabel="Borrando imágenes..."
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isDeletingAllImages}
        disableClose={isDeletingAllImages}
        onConfirm={handleDeleteAllImages}
      />

      <AppDialog
        isOpen={uploadLimitMessage !== null}
        onClose={() => setUploadLimitMessage(null)}
        navbarTitle="Límite de imágenes"
        title="No se pueden subir esas imágenes"
        description={<p>{uploadLimitMessage}</p>}
        confirmLabel="Entendido"
        showCancelButton={false}
        onConfirm={() => setUploadLimitMessage(null)}
      />
    </div>
  );
}
