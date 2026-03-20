"use client";

import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useSelectedConsultationStore } from "@/context/selectedConsultationStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";

import {
  insertConsultation,
  getConsultationsByPetId,
} from "@/lib/queries/consultations";

import { useCallback, useEffect, useState } from "react";

export const useConsultations = () => {
  const { activeVet } = useActiveVetStore();
  const { activeClinic } = useClinicStore();
  const { selectedPet } = useSelectedPetStore();
  const { setSelectedConsultation } = useSelectedConsultationStore();

  const [consultationsByPet, setConsultationsByPet] = useState<any[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

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

      const newConsultation = {
        pet_id: petId,
        vet_id: activeVet.vet_id,
        clinic_id: activeClinic.clinic_id,
        consultation_date: new Date().toISOString(),
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

  // ========= FETCH CONSULTATIONS BY PET =========
  const fetchConsultationsByPet = useCallback(async () => {
    if (!selectedPet?.pet_id) {
      setConsultationsByPet([]);
      return;
    }

    setLoadingConsultations(true);

    const data = await getConsultationsByPetId(selectedPet.pet_id);

    setConsultationsByPet(data);

    setLoadingConsultations(false);
  }, [selectedPet]);

  // ========= AUTO UPDATE WHEN PET CHANGES =========
  useEffect(() => {
    fetchConsultationsByPet();
  }, [fetchConsultationsByPet]);

  return {
    addConsultation,
    consultationsByPet,
    fetchConsultationsByPet,
    loadingConsultations,
  };
};
