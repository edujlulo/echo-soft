"use client";

import { create } from "zustand";

interface EditableSelectListState {
  activeField: string | null; // campo que tiene foco
  setActiveField: (field: string | null) => void;
  getTitle: () => string; // devuelve el título actual de la tabla
}

export const useEditableSelectListStore = create<EditableSelectListState>(
  (set, get) => ({
    activeField: null,

    setActiveField: (field: string | null) => set({ activeField: field }),

    getTitle: () => {
      return get().activeField ?? "FRASES"; // si no hay campo activo, título por defecto
    },
  }),
);
