"use client";

import { create } from "zustand";
import { Database } from "@/types/database";

type Pet = Database["public"]["Tables"]["pets"]["Row"];

export type NewPet = Omit<Pet, "pet_id" | "record_number"> &
  Partial<Pick<Pet, "pet_id" | "record_number">>;

type SelectedPet = Pet | NewPet;

export const emptyPet: Omit<Pet, "pet_id" | "record_number"> = {
  name: "",
  owner: "",
  vet_id: "",
  clinic_id: "",
  allergies: null,
  birth_date: null,
  breed: null,
  color: null,
  diagnosis: null,
  image_path: null,
  last_visit_date: null,
  microchip: null,
  notes: null,
  pedigree: null,
  referred_by: null,
  registration_date: null,
  sex: null,
  species: null,
  status: null,
  weight: null,
};

interface SelectedPetState {
  selectedPet: Pet | NewPet | null;

  isCreating: boolean;
  isEditing: boolean;

  // justCreatedPet: boolean; // <-- new flag

  setSelectedPet: (pet: Pet | NewPet | null) => void;
  // setJustCreatedPet: (value: boolean) => void;

  startCreating: () => void;
  startEditing: () => void;

  stopCreating: () => void;
  stopEditing: () => void;

  resetSelectedPet: () => void;
}

export const useSelectedPetStore = create<SelectedPetState>((set) => ({
  selectedPet: null,

  isCreating: false,
  isEditing: false,

  // justCreatedPet: false, // valor inicial

  setSelectedPet: (pet) =>
    set({
      selectedPet: pet,
    }),

  // setJustCreatedPet: (value: boolean) => set({ justCreatedPet: value }),

  startCreating: () =>
    set({
      selectedPet: emptyPet,
      isCreating: true,
      isEditing: false,
      // justCreatedPet: false,
    }),

  startEditing: () =>
    set({
      isEditing: true,
      isCreating: false,
    }),

  stopCreating: () =>
    set({
      isCreating: false,
    }),

  stopEditing: () =>
    set({
      isEditing: false,
    }),

  resetSelectedPet: () =>
    set({
      isCreating: false,
      isEditing: false,
      // justCreatedPet: false,
    }),
}));
