// "use client";

// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import { Database } from "@/types/database";

// type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

// interface ConsultationFormState {
//   formConsultation: ConsultationRow | null;

//   isSavingConsultation: boolean;
//   statusMessageConsultation: string | null;
//   errorsConsultation: Record<string, string | undefined>;

//   // actions

//   loadFromSelected: (consultation: ConsultationRow | null) => void;

//   setFieldConsultation: <K extends keyof ConsultationRow>(
//     field: K,
//     value: ConsultationRow[K]
//   ) => void;

//   setIsSavingConsultation: (saving: boolean) => void;

//   setStatusMessageConsultation: (msg: string | null) => void;

//   setErrorsConsultation: (errors: Record<string, string | undefined>) => void;

//   clearForm: () => void;
// }

// export const useConsultationFormStore = create(
//   immer<ConsultationFormState>((set) => ({
//     formConsultation: null,

//     isSavingConsultation: false,
//     statusMessageConsultation: null,
//     errorsConsultation: {},

//     // ✅ copiar desde selectedConsultationStore
//     loadFromSelected: (consultation) =>
//       set((state) => {
//         state.formConsultation = consultation ? { ...consultation } : null;
//       }),

//     setFieldConsultation: (field, value) =>
//       set((state) => {
//         if (!state.formConsultation) return;

//         state.formConsultation[field] = value as any;
//       }),

//     setIsSavingConsultation: (saving) =>
//       set((state) => {
//         state.isSavingConsultation = saving;
//       }),

//     setStatusMessageConsultation: (msg) =>
//       set((state) => {
//         state.statusMessageConsultation = msg;
//       }),

//     setErrorsConsultation: (errors) =>
//       set((state) => {
//         state.errorsConsultation = errors;
//       }),

//     clearForm: () =>
//       set((state) => {
//         state.formConsultation = null;
//       }),
//   }))
// );
