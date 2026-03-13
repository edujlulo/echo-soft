"use client";

import { create } from "zustand";
import { Database } from "@/types/database";

type Pet = Database["public"]["Tables"]["pets"]["Row"];

type NewPet = Omit<Pet, "pet_id"> & Partial<Pick<Pet, "pet_id">>;

const emptyPet: Omit<Pet, "pet_id"> = {
  name: "",
  owner: "",
  vet_id: "",
  clinic_id: "",
  record_number: 0,
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

  setSelectedPet: (pet: Pet | NewPet | null) => void;

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

  setSelectedPet: (pet) =>
    set({
      selectedPet: pet,
    }),

  startCreating: () =>
    set({
      selectedPet: emptyPet,
      isCreating: true,
      isEditing: false,
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
      selectedPet: null,
      isCreating: false,
      isEditing: false,
    }),
}));
