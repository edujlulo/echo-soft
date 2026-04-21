"use client";

import { useRef, useState } from "react";
import Button from "@/components/Button";
import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useConsultationStore } from "@/context/consultationStore";
import AppDialog from "@/components/AppDialog";
import { ultrasoundUploadManager } from "@/lib/uploads/ultrasoundUploadManager";
import { useUltrasoundUploadManager } from "@/components/providers/UltrasoundUploadManagerProvider";

interface Props {
  onUploadComplete?: () => Promise<void> | void;
  deleteAllUltrasoundImages: (consultationId: string) => Promise<number | void>;
  isDeletingAllImages: boolean;
}

export default function UltrasoundImagesActions({
  onUploadComplete,
  deleteAllUltrasoundImages,
  isDeletingAllImages,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  const { state: uploadManagerState } = useUltrasoundUploadManager();

  const isUploading = uploadManagerState.items.some(
    (item) => item.status === "queued" || item.status === "uploading",
  );

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

  // function handleTestGlobalUploadOverlay() {
  //   const uploadId = crypto.randomUUID();

  //   ultrasoundUploadManager.registerItem({
  //     id: uploadId,
  //     fileName: "test-ultrasound-image.jpg",
  //     consultationId: "test-consultation",
  //     petId: null,
  //     clinicId: null,
  //     vetId: null,
  //     status: "uploading",
  //     percentage: 0,
  //     uploadedBytes: 0,
  //     totalBytes: 10 * 1024 * 1024,
  //     error: null,
  //   });

  //   let uploaded = 0;
  //   const total = 10 * 1024 * 1024;

  //   const interval = window.setInterval(() => {
  //     uploaded += 512 * 1024;

  //     const percentage = Math.min(100, Math.round((uploaded / total) * 100));

  //     ultrasoundUploadManager.updateItem(uploadId, {
  //       uploadedBytes: Math.min(uploaded, total),
  //       totalBytes: total,
  //       percentage,
  //       status: percentage >= 100 ? "success" : "uploading",
  //     });

  //     if (percentage >= 100) {
  //       window.clearInterval(interval);
  //     }
  //   }, 250);
  // }

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
      await ultrasoundUploadManager.enqueueUltrasoundUploads({
        files,
        clinicId,
        vetId,
        petId,
        consultationId,
        onUploadComplete,
      });

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

      {/* <button
        type="button"
        onClick={handleTestGlobalUploadOverlay}
        className="mt-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        Test global upload overlay
      </button> */}

      <Button
        type="button"
        onClick={handleOpenDeleteAllDialog}
        disabled={isDeletingAllImages || isUploading}
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
    </div>
  );
}
