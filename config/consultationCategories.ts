import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

export type ConsultationCategory = {
  label: string;
  key: keyof ConsultationRow | null;
  hasNotes?: boolean;
  notesKey?: string;
};

export const consultationCategories: ConsultationCategory[] = [
  {
    label: "MOTIVOS",
    key: "reason_for_ultrasound",
    hasNotes: true,
    notesKey: "reason_for_ultrasound_notes",
  },
  {
    label: "EQUIPOS",
    key: "equipment_used",
    hasNotes: true,
    notesKey: "equipment_used_notes",
  },
  {
    label: "VEJIGA URINARIA",
    key: "urinary_bladder",
    hasNotes: true,
    notesKey: "urinary_bladder_notes",
  },
  {
    label: "BAZO",
    key: "spleen",
    hasNotes: true,
    notesKey: "spleen_notes",
  },
  {
    label: "PÁNCREAS",
    key: "pancreas",
    hasNotes: true,
    notesKey: "pancreas_notes",
  },
  {
    label: "RIÑÓN IZQUIERDO",
    key: "left_kidney",
    hasNotes: true,
    notesKey: "left_kidney_notes",
  },
  {
    label: "HÍGADO",
    key: "liver",
    hasNotes: true,
    notesKey: "liver_notes",
  },
  {
    label: "ÚTERO",
    key: "uterus",
    hasNotes: true,
    notesKey: "uterus_notes",
  },
  {
    label: "RIÑÓN DERECHO",
    key: "right_kidney",
    hasNotes: true,
    notesKey: "right_kidney_notes",
  },
  {
    label: "VESÍCULA BILIAR",
    key: "gallbladder",
    hasNotes: true,
    notesKey: "gallbladder_notes",
  },
  {
    label: "ESTÓMAGO",
    key: "stomach",
    hasNotes: true,
    notesKey: "stomach_notes",
  },
  {
    label: "INTESTINO DELGADO",
    key: "small_intestine",
    hasNotes: true,
    notesKey: "small_intestine_notes",
  },
  {
    label: "INTESTINO GRUESO",
    key: "colon",
    hasNotes: true,
    notesKey: "colon_notes",
  },
  {
    label: "URETRA",
    key: "urethra",
    hasNotes: true,
    notesKey: "urethra_notes",
  },
  {
    label: "LINFONODOS",
    key: "lymph_nodes",
    hasNotes: true,
    notesKey: "lymph_nodes_notes",
  },
  {
    label: "GLÁNDULAS ADRENALES",
    key: "adrenal_glands",
    hasNotes: true,
    notesKey: "adrenal_glands_notes",
  },
  {
    label: "PRÓSTATA",
    key: null,
  },
  {
    label: "TESTÍCULOS",
    key: null,
  },
  {
    label: "OVARIOS",
    key: "ovaries",
    hasNotes: true,
    notesKey: "ovaries_notes",
  },
  {
    label: "GLÁNDULA TIROIDES",
    key: "thyroid_glands",
    hasNotes: true,
    notesKey: "thyroid_glands_notes",
  },
  {
    label: "GLÁNDULA MAMARIA",
    key: "mammary_glands",
    hasNotes: true,
    notesKey: "mammary_notes",
  },
  {
    label: "OCULAR",
    key: "ocular_study",
    hasNotes: true,
    notesKey: "ocular_notes",
  },
  {
    label: "MUSCULAR",
    key: "muscular_study",
    hasNotes: true,
    notesKey: "muscular_study_notes",
  },
  {
    label: "HUESOS",
    key: "bones_others",
    hasNotes: true,
    notesKey: "bones_others_notes",
  },
  {
    label: "TÓRAX, PULMONES",
    key: "thorax_lungs",
    hasNotes: true,
    notesKey: "thorax_lungs_notes",
  },
  {
    label: "OTROS",
    key: "others",
    hasNotes: true,
    notesKey: "others_notes",
  },
  {
    label: "GRANDES VASOS, VENAS Y ARTERIAS",
    key: "major_vessels",
    hasNotes: true,
    notesKey: "major_vessels_notes",
  },
  {
    label: "CAVIDAD ABDOMINAL",
    key: "abdominal_cavity",
    hasNotes: true,
    notesKey: "abdominal_cavity_notes",
  },
  {
    label: "CONCLUSIONES",
    key: "conclusions",
    hasNotes: true,
    notesKey: "conclusions_notes",
  },
  {
    label: "OBSERVACIONES",
    key: "observations",
    hasNotes: true,
    notesKey: "observations_notes",
  },
];
