"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { updatePet } from "@/lib/queries/pets";
import { Database } from "@/types/database";

type PetUpdate = Database["public"]["Tables"]["pets"]["Update"];
type PetRow = Database["public"]["Tables"]["pets"]["Row"];

interface FormErrors {
  [key: string]: string | undefined;
}

export function useConsultationPetForm() {
  const { selectedPet, setSelectedPet } = useSelectedPetStore();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Ref para acumular cambios locales
  const pendingChanges = useRef<PetUpdate>({});

  // Ref para el debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // -------------------
  // Set field: actualiza estado local + almacena cambios pendientes
  // -------------------
  const setField = useCallback(
    (field: keyof PetUpdate, value: string | null) => {
      if (!selectedPet) return;

      // Actualiza estado en Zustand inmediatamente
      setSelectedPet({
        ...selectedPet,
        [field]: value,
      } as PetRow);

      // Acumula cambios pendientes
      pendingChanges.current = {
        ...pendingChanges.current,
        [field]: value,
      };

      // Reinicia debounce
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        savePet();
      }, 2000);
    },
    [selectedPet, setSelectedPet],
  );

  // -------------------
  // Save pet to Supabase
  // -------------------
  const savePet = useCallback(async () => {
    if (!selectedPet?.pet_id) return;

    const changes = pendingChanges.current;
    if (Object.keys(changes).length === 0) return; // nada que guardar

    setIsSaving(true);
    // setStatusMessage("Guardando cambios...");

    try {
      const updatedPet: PetRow = await updatePet(selectedPet.pet_id, changes);

      // Actualiza Zustand con los datos confirmados por Supabase
      setSelectedPet(updatedPet);

      // Limpia cambios pendientes
      pendingChanges.current = {};

      setStatusMessage("Guardado correctamente!");
      setTimeout(() => setStatusMessage(null), 1000);
    } catch (err: any) {
      console.error("Error guardando mascota:", err);
      setStatusMessage("Error guardando mascota");
      setTimeout(() => setStatusMessage(null), 2000);
    } finally {
      setIsSaving(false);
    }
  }, [selectedPet, setSelectedPet]);

  // -------------------
  // Cleanup al desmontar
  // -------------------
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      // Solo guardar si hay cambios pendientes
      if (Object.keys(pendingChanges.current).length > 0) {
        savePet();
      }
    };
  }, []);

  // -------------------
  // Function for calculate pet age
  // -------------------
  function calculateAge(birthDateStr: string | undefined) {
    if (!birthDateStr) return "";

    const birthDate = new Date(birthDateStr);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
      months -= 1; // no ha cumplido el mes completo
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years > 0) {
      return `${years} año${years > 1 ? "s" : ""} ${months} mes${months !== 1 ? "es" : ""}`;
    } else {
      return `${months} mes${months !== 1 ? "es" : ""}`;
    }
  }

  return {
    selectedPet,
    setField,
    isSaving,
    statusMessage,
    errors,
    calculateAge,
    savePet, // opcional: guardar manualmente todos los cambios
  };
}
