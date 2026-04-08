"use client";

import { useRef } from "react";
import Button from "@/components/Button";
import { useUltrasoundImages } from "@/hooks/useUltrasoundImages";
import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useConsultationStore } from "@/context/consultationStore";

export default function UltrasoundImagesActions() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { uploadUltrasoundImages, isUploading } = useUltrasoundImages();

  const clinicId = useClinicStore((s) => s.activeClinic?.clinic_id);
  const vetId = useActiveVetStore((s) => s.activeVet?.vet_id);
  const petId = useSelectedPetStore((s) => s.selectedPet?.pet_id);
  const consultationId = useConsultationStore(
    (s) => s.selectedConsultation?.consultation_id,
  );

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
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
        disabled={isUploading}
      >
        {isUploading
          ? "Subiendo imágenes..."
          : "Copiar imágenes desde la carpeta"}
      </Button>

      <Button type="button">Borrar todas las imágenes</Button>
    </div>
  );
}
