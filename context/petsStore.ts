"use client";

import { create } from "zustand";
import { Database } from "@/types/database";

type Pet = Database["public"]["Tables"]["pets"]["Row"];

interface PetsState {
  pets: Pet[];
  setPets: (pets: Pet[]) => void;
}

export const usePetsStore = create<PetsState>((set) => ({
  pets: [],
  setPets: (pets) => set({ pets }),
}));
