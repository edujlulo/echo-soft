"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface ConsultationStoreState {
  // --------- Datos ---------
  formConsultation: ConsultationRow | null; // copia editable
  selectedConsultation: ConsultationRow | null; // fuente de verdad global

  // --------- Estado UI ---------
  isSavingConsultation: boolean;
  statusMessageConsultation: string | null;
  errorsConsultation: Record<string, string | undefined>;

  // --------- Acciones ---------
  loadFromSelected: (consultation: ConsultationRow | null) => void;
  setFieldConsultation: <K extends keyof ConsultationRow>(
    field: K,
    value: ConsultationRow[K]
  ) => void;
  setSelectedConsultation: (consultation: ConsultationRow | null) => void;
  setIsSavingConsultation: (saving: boolean) => void;
  setStatusMessageConsultation: (msg: string | null) => void;
  setErrorsConsultation: (errors: Record<string, string | undefined>) => void;
  clearForm: () => void;
}

export const useConsultationStore = create(
  immer<ConsultationStoreState>((set) => ({
    formConsultation: null,
    selectedConsultation: null,

    isSavingConsultation: false,
    statusMessageConsultation: null,
    errorsConsultation: {},

    // --------- Acciones ---------
    loadFromSelected: (consultation) =>
      set((state) => {
        state.formConsultation = consultation ? { ...consultation } : null;
      }),

    setFieldConsultation: (field, value) =>
      set((state) => {
        if (!state.formConsultation) return;
        state.formConsultation[field] = value as any;
      }),

    setSelectedConsultation: (consultation) =>
      set((state) => {
        state.selectedConsultation = consultation;
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

    clearForm: () =>
      set((state) => {
        state.formConsultation = null;
      }),
  }))
);
