import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface ConsultationFormState {
  selectedConsultation: ConsultationRow | null;
  isSavingConsultation: boolean;
  statusMessageConsultation: string | null;
  errorsConsultation: Record<string, string | undefined>;

  // Actions
  setSelectedConsultation: (consultation: ConsultationRow | null) => void;
  setFieldConsultation: (
    field: keyof ConsultationRow,
    value: string | null,
  ) => void;
  setIsSavingConsultation: (saving: boolean) => void;
  setStatusMessageConsultation: (msg: string | null) => void;
  setErrorsConsultation: (errors: Record<string, string | undefined>) => void;
}

export const useConsultationFormStore = create(
  immer<ConsultationFormState>((set) => ({
    selectedConsultation: null,
    isSavingConsultation: false,
    statusMessageConsultation: null,
    errorsConsultation: {},

    setSelectedConsultation: (consultation) =>
      set((state) => {
        state.selectedConsultation = consultation;
      }),

    setFieldConsultation: (field, value) =>
      set((state) => {
        if (!state.selectedConsultation) return;
        state.selectedConsultation[field] = value;
      }),

    setIsSavingConsultation: (saving) =>
      set((state) => {
        state.isSavingConsultation = saving;
      }),

    setStatusMessageConsultation: (msg) =>
      set((state) => {
        state.statusMessageConsultation = msg;
      }),

    setErrorsConsultation: (errors) =>
      set((state) => {
        state.errorsConsultation = errors;
      }),
  })),
);
