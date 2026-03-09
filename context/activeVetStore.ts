"use client";

import { create } from "zustand";
import { Vet } from "@/hooks/useVeterinarians";

interface ActiveVetState {
  activeVet: Vet | null; // veterinario activo
  setActiveVet: (vet: Vet) => void; // para seleccionarlo
  clearActiveVet: () => void; // para deseleccionarlo
}

export const useActiveVetStore = create<ActiveVetState>((set) => ({
  activeVet: null,
  setActiveVet: (vet) => set({ activeVet: vet }),
  clearActiveVet: () => set({ activeVet: null }),
}));
