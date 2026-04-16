"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

type ReportMode = "organs" | "full-template";

interface ConsultationStoreState {
  formConsultation: ConsultationRow | null;
  selectedConsultation: ConsultationRow | null;

  isSavingConsultation: boolean;
  statusMessageConsultation: string | null;
  errorsConsultation: Record<string, string | undefined>;

  loadFromSelected: (consultation: ConsultationRow | null) => void;
  setFieldConsultation: <K extends keyof ConsultationRow>(
    field: K,
    value: ConsultationRow[K],
  ) => void;
  setSelectedConsultation: (consultation: ConsultationRow | null) => void;
  setIsSavingConsultation: (saving: boolean) => void;
  setStatusMessageConsultation: (msg: string | null) => void;
  setErrorsConsultation: (errors: Record<string, string | undefined>) => void;
  clearForm: () => void;

  reportMode: ReportMode;
  manualReportDraft: string;

  setReportMode: (mode: ReportMode) => void;
  setManualReportDraft: (value: string) => void;
  loadManualReportDraft: (value: string) => void;

  hydrateReportStateFromConsultation: (
    consultation: ConsultationRow | null,
  ) => void;
}

export const useConsultationStore = create<ConsultationStoreState>()(
  devtools(
    immer((set) => ({
      formConsultation: null,
      selectedConsultation: null,

      reportMode: "organs",
      manualReportDraft: "",

      isSavingConsultation: false,
      statusMessageConsultation: null,
      errorsConsultation: {},

      setReportMode: (mode) =>
        set((state) => {
          state.reportMode = mode;
        }),

      setManualReportDraft: (value) =>
        set((state) => {
          state.manualReportDraft = value;
        }),

      loadManualReportDraft: (value) =>
        set((state) => {
          state.manualReportDraft = value;
        }),

      hydrateReportStateFromConsultation: (consultation) =>
        set((state) => {
          state.reportMode =
            consultation?.report_mode === "full-template"
              ? "full-template"
              : "organs";
          state.manualReportDraft = consultation?.manual_report_draft ?? "";
        }),

      loadFromSelected: (consultation) =>
        set((state) => {
          state.formConsultation = consultation ? { ...consultation } : null;
          state.reportMode =
            consultation?.report_mode === "full-template"
              ? "full-template"
              : "organs";
          state.manualReportDraft = consultation?.manual_report_draft ?? "";
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
          state.reportMode = "organs";
          state.manualReportDraft = "";
        }),
    })),
    {
      name: "consultation-store",
    },
  ),
);
