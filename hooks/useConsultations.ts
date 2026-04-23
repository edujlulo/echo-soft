"use client";

import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useConsultationStore } from "@/context/consultationStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";

import {
  insertConsultation,
  getConsultationsByPetId,
  deleteConsultationWithImages,
} from "@/lib/queries/consultations";
import { Database } from "@/types/database";
import { buildSuggestedPdfName } from "@/reports/pdfNameUtils";

import { useCallback, useEffect, useState } from "react";

export const useConsultations = () => {
  const { activeVet } = useActiveVetStore();
  const { activeClinic } = useClinicStore();
  const { selectedPet } = useSelectedPetStore();
  const { setSelectedConsultation, loadFromSelected, clearForm } =
    useConsultationStore();

  const [consultationsByPet, setConsultationsByPet] = useState<any[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [isDeletingConsultation, setIsDeletingConsultation] = useState(false);

  // ========= INSERT NEW CONSULTATION =========
  const addConsultation = useCallback(
    async (petId: string) => {
      if (petId === "") {
        console.error("No pet id available");
        return null;
      }

      if (!activeVet || !activeClinic || !selectedPet) {
        console.error("No active vet, clinic or pet selected");
        return null;
      }

      const consultationDate = new Date().toISOString();

      const newConsultation = {
        pet_id: petId,
        vet_id: activeVet.vet_id,
        clinic_id: activeClinic.clinic_id,
        consultation_date: consultationDate,
        suggested_pdf_name: buildSuggestedPdfName(selectedPet, {
          consultation_date: consultationDate,
        }),
        vet_name: activeVet.name,
        report_title: "INFORME DE ECOGRAFÍA",
      };

      const result = await insertConsultation(newConsultation);

      if (result) {
        setSelectedConsultation(result);
      }

      // refrescar lista después de insertar
      if (selectedPet?.pet_id) {
        const data = await getConsultationsByPetId(selectedPet.pet_id);
        setConsultationsByPet(data);
      }

      return result;
    },
    [activeVet, activeClinic, selectedPet],
  );

  // ========= DELETE CONSULTATION =========
  const deleteConsultation = useCallback(
    async (
      consultation: Database["public"]["Tables"]["consultations"]["Row"],
    ) => {
      if (!consultation?.consultation_id) {
        throw new Error("No consultation selected");
      }

      if (!activeVet) {
        throw new Error("No active veterinarian available");
      }

      const isOwnerOrAdmin =
        activeVet.role === "owner" || activeVet.role === "admin";

      const isOwnerOfConsultation = consultation.vet_id === activeVet.vet_id;

      if (!isOwnerOfConsultation && !isOwnerOrAdmin) {
        throw new Error(
          "No tiene permiso para borrar esta consulta. Solo puede borrarla el veterinario que la creó, o un usuario con rol owner o admin.",
        );
      }

      setIsDeletingConsultation(true);

      try {
        await deleteConsultationWithImages(consultation.consultation_id);

        setSelectedConsultation(null);
        loadFromSelected(null);
        clearForm();

        if (selectedPet?.pet_id) {
          const updatedConsultations = await getConsultationsByPetId(
            selectedPet.pet_id,
          );
          setConsultationsByPet(updatedConsultations);
        } else {
          setConsultationsByPet([]);
        }
      } finally {
        setIsDeletingConsultation(false);
      }
    },
    [
      activeVet,
      selectedPet,
      setSelectedConsultation,
      loadFromSelected,
      clearForm,
    ],
  );

  // ========= FETCH CONSULTATIONS BY PET =========
  const fetchConsultationsByPet = useCallback(async () => {
    if (!selectedPet?.pet_id) {
      setConsultationsByPet([]);
      setSelectedConsultation(null);
      loadFromSelected(null);
      clearForm();
      return;
    }

    setLoadingConsultations(true);

    setSelectedConsultation(null);
    loadFromSelected(null);

    try {
      const data = await getConsultationsByPetId(selectedPet.pet_id);

      setConsultationsByPet(data);

      const firstConsultation = data[0] ?? null;

      setSelectedConsultation(firstConsultation);
      loadFromSelected(firstConsultation);
    } finally {
      setLoadingConsultations(false);
    }
  }, [selectedPet, setSelectedConsultation, loadFromSelected, clearForm]);

  // ========= AUTO UPDATE WHEN PET CHANGES =========
  useEffect(() => {
    fetchConsultationsByPet();
  }, [fetchConsultationsByPet]);

  return {
    addConsultation,
    deleteConsultation,
    consultationsByPet,
    fetchConsultationsByPet,
    loadingConsultations,
    isDeletingConsultation,
  };
};
