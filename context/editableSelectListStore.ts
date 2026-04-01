"use client";

import { create } from "zustand";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface EditableSelectListState {
  activeField: string | null; // field that has focus
  setActiveField: (field: string | null) => void;
  getTitle: () => string; // returns the current table title

  activeCategory: string | null;
  // setActiveCategory: (category: keyof ConsultationRow | null) => void;
  setActiveCategory: (field: string | null) => void;
}

export const useEditableSelectListStore = create<EditableSelectListState>(
  (set, get) => ({
    activeField: null,
    activeCategory: null, // initialize category as null

    setActiveField: (field: string | null) => set({ activeField: field }),

    getTitle: () => {
      return get().activeField ?? "FRASES"; // default title if no active field
    },

    setActiveCategory: (category: string | null) =>
      set({ activeCategory: category }),

    // setActiveCategory: (category: keyof ConsultationRow | null) =>
    //   set({ activeCategory: category }),
  })
);
