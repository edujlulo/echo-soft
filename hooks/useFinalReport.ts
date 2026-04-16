"use client";

import { useMemo } from "react";
import { useConsultationStore } from "@/context/consultationStore";
import { useConsultationReportBuilder } from "@/hooks/useConsultationReportBuilder";

export function useFinalReport() {
  const { report: organsReport } = useConsultationReportBuilder();

  const reportMode = useConsultationStore((state) => state.reportMode);
  const manualReportDraft = useConsultationStore(
    (state) => state.manualReportDraft,
  );

  const finalReport = useMemo(() => {
    return reportMode === "full-template" ? manualReportDraft : organsReport;
  }, [reportMode, manualReportDraft, organsReport]);

  return {
    reportMode,
    manualReportDraft,
    organsReport,
    finalReport,
  };
}
