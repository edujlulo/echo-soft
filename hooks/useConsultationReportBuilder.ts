"use client";

import { useMemo } from "react";
import { useConsultationStore } from "@/context/consultationStore";
import { buildConsultationReport } from "@/reports/buildConsultationReport";

// FUNCTION FOR FORMAT TEXT FOR DISPLAY
const SEP = "\u{241F}"; // separador invisible

function formatForDisplay(text: string) {
  return text.replaceAll(SEP, ", "); // separador visible para el usuario
}

/**
 * Hook para generar el informe clínico a partir del formConsultation
 */
export function useConsultationReportBuilder() {
  const formConsultation = useConsultationStore(
    (state) => state.formConsultation
  );

  const report = useMemo(() => {
    return formatForDisplay(buildConsultationReport(formConsultation));
  }, [formConsultation]);

  return {
    report,
  };
}
