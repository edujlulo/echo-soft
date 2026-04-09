"use client";

import { useRef, useState } from "react";
import Button from "@/components/Button";
import { useUltrasoundImages } from "@/hooks/useUltrasoundImages";
import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useConsultationStore } from "@/context/consultationStore";
import AppDialog from "@/components/AppDialog";

interface Props {
  onUploadComplete?: () => Promise<void> | void;
}

export default function UltrasoundImagesActions({ onUploadComplete }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  const {
    uploadUltrasoundImages,
    deleteAllUltrasoundImages,
    isUploading,
    isDeletingAllImages,
  } = useUltrasoundImages();

  const clinicId = useClinicStore((s) => s.activeClinic?.clinic_id);
  const vetId = useActiveVetStore((s) => s.activeVet?.vet_id);
  const petId = useSelectedPetStore((s) => s.selectedPet?.pet_id);
  const consultationId = useConsultationStore(
    (s) => s.selectedConsultation?.consultation_id,
  );

  function handleOpenFilePicker() {
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

  async function handleFilesSelected(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    if (!clinicId || !vetId || !petId || !consultationId) {
      console.error("Missing required IDs for ultrasound image upload.");
      return;
    }

    try {
      await uploadUltrasoundImages({
        files,
        clinicId,
        vetId,
        petId,
        consultationId,
      });

      await onUploadComplete?.();

      // limpiar input para permitir volver a subir los mismos archivos
      event.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
    }
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-start">
      {/* INPUT OCULTO */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      {/* BOTÓN PRINCIPAL */}
      <Button
        type="button"
        onClick={handleOpenFilePicker}
        disabled={isUploading || isDeletingAllImages}
      >
        {isUploading
          ? "Subiendo imágenes..."
          : "Copiar imágenes desde la carpeta"}
      </Button>

      <Button
        type="button"
        onClick={handleOpenDeleteAllDialog}
        disabled={isDeletingAllImages || isUploading}
      >
        {isDeletingAllImages ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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
    </div>
  );
}
