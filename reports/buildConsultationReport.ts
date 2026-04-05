import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

/**
 * Mapa de campos → etiquetas del informe
 */
const ORGAN_MAP: { key: keyof ConsultationRow; label: string }[] = [
  { key: "liver", label: "HIGADO" },
  { key: "spleen", label: "BAZO" },
  { key: "stomach", label: "ESTOMAGO" },
  { key: "pancreas", label: "PANCREAS" },
  { key: "gallbladder", label: "VESICULA BILIAR" },
  { key: "left_kidney", label: "RIÑON IZQUIERDO" },
  { key: "right_kidney", label: "RIÑON DERECHO" },
  { key: "urinary_bladder", label: "VEJIGA URINARIA" },
  { key: "urethra", label: "URETRA" },
  { key: "uterus", label: "UTERO" },
  { key: "ovaries", label: "OVARIOS" },
  { key: "colon", label: "COLON" },
  { key: "small_intestine", label: "INTESTINO DELGADO" },
  { key: "lymph_nodes", label: "LINFONODOS" },
  { key: "major_vessels", label: "GRANDES VASOS" },
  { key: "thyroid_glands", label: "GLANDULAS TIROIDES" },
  { key: "adrenal_glands", label: "GLANDULAS ADRENALES" },
  { key: "thorax_lungs", label: "TORAX Y PULMONES" },
  { key: "abdominal_cavity", label: "CAVIDAD ABDOMINAL" },
  { key: "mammary_glands", label: "GLANDULAS MAMARIAS" },
  { key: "muscular_study", label: "ESTUDIO MUSCULAR" },
  { key: "ocular_study", label: "ESTUDIO OCULAR" },
  { key: "bones_others", label: "HUESOS Y OTROS" },
  { key: "others", label: "OTROS" },
];

/**
 * Construye el informe clínico basado en formConsultation
 */
export function buildConsultationReport(
  consultation: ConsultationRow | null,
): string {
  if (!consultation) return "";

  const sections: string[] = [];

  for (const { key, label } of ORGAN_MAP) {
    const value = consultation[key];

    if (typeof value === "string" && value.trim() !== "") {
      sections.push(`${label}: ${value.trim()}`);
    }
  }

  sections.push(`La interpretación y observaciones emitidas en este documento son relativas a imagenes obtenidas y evaluadas al momento del examen ecográfico, pudiendo sufrir alteraciones de acuerdo con la evolución en el cuadro clínico del paciente. El estudio ecográfico es un metodo complementario para el diagnostico final del paciente que no determina función ni tipo celular de organos por lo que es importante conjuntar historia clínica examen físico final y estudios de laboratorio.

El estudio ecográfico requiere la interpretación del médico veterinario.`);

  return sections.join("\n\n");
}
