"use client";

import { create } from "zustand";
import { Database } from "@/types/database";

type Consultation = Database["public"]["Tables"]["consultations"]["Row"];

interface SelectedConsultationState {
  selectedConsultation: Consultation | null;

  setSelectedConsultation: (consultation: Consultation | null) => void;

  // resetSelectedConsultation: () => void;
}

export const useSelectedConsultationStore = create<SelectedConsultationState>(
  (set) => ({
    selectedConsultation: null,

    setSelectedConsultation: (consultation) =>
      set({
        selectedConsultation: consultation,
      }),

    // resetSelectedConsultation: () => set({}),
  }),
);
