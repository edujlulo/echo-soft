"use client";

import { useState } from "react";
import { Database } from "@/types/database";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { addPet } from "@/lib/services/petService";
import { updatePet } from "@/lib/queries/pets";

type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];
type PetUpdate = Database["public"]["Tables"]["pets"]["Update"];
type PetRow = Database["public"]["Tables"]["pets"]["Row"];

export interface FormErrors {
  owner?: string;
  name?: string;
  [key: string]: string | undefined;
}

export function usePetForm(onSuccess: (pet: any) => void) {
  const {
    selectedPet,
    setSelectedPet,
    startCreating,
    stopCreating,
    isCreating,
    isEditing,
    stopEditing,
  } = useSelectedPetStore();

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // -------------------
  // Bind inputs
  // -------------------

  const setField = (field: keyof PetInsert, value: string) => {
    if (!selectedPet) return;

    setSelectedPet({
      ...selectedPet,
      [field]: value,
    } as any);
  };

  // -------------------
  // Validation
  // -------------------

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!selectedPet?.owner?.trim())
      newErrors.owner = "El propietario es obligatorio";

    if (!selectedPet?.name?.trim()) newErrors.name = "El nombre es obligatorio";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -------------------
  // CREATE
  // -------------------

  const createPet = async () => {
    const newPet = await addPet(selectedPet as PetInsert);
    return newPet;
  };

  // -------------------
  // UPDATE
  // -------------------

  const editPet = async () => {
    const updatedPet = await updatePet(
      selectedPet?.pet_id!,
      selectedPet as PetUpdate,
    );

    return updatedPet;
  };

  // -------------------
  // SUBMIT (auto detect create/edit)
  // -------------------

  const submit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    setStatusMessage(
      isCreating ? "Guardando mascota..." : "Actualizando mascota...",
    );

    try {
      let pet: PetRow | undefined;

      if (isCreating) {
        pet = await createPet();
      } else if (isEditing) {
        pet = await editPet();
      }

      setStatusMessage("Guardado exitosamente!");

      setTimeout(() => {
        setStatusMessage(null);

        stopCreating();
        stopEditing();

        onSuccess(pet);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setStatusMessage("Error guardando mascota");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedPet,
    setField,

    errors,
    isSubmitting,
    statusMessage,

    submit,

    startCreating,
    stopCreating,

    isCreating,
    isEditing,
  };
}
