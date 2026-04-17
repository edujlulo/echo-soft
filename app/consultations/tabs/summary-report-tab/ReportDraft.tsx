"use client";

import { useConsultationStore } from "@/context/consultationStore";
import { useFinalReport } from "@/hooks/useFinalReport";
import { useManualReportDraftSave } from "@/hooks/useManualReportDraftSave";
import { useEffect } from "react";

export default function ReportDraft() {
  const { reportMode, finalReport } = useFinalReport();
  const setManualReportDraft = useConsultationStore(
    (state) => state.setManualReportDraft
  );

  const { isSavingManualReportDraft, flushManualReportDraftSave } =
    useManualReportDraftSave();

  const isEditable = reportMode === "full-template";

  useEffect(() => {
    return () => {
      void flushManualReportDraftSave();
    };
  }, [flushManualReportDraftSave]);

  return (
    <>
      <div className="-mt-2 px-2 flex flex-col gap-1 items-start text-sm relative">
        <label className="w-full font-bold text-blue-950 items-center justify-center text-center text-lg">
          {reportMode === "full-template"
            ? "Informe creado desde plantilla y edición libre"
            : "Informe creado por órganos"}
        </label>

        <textarea
          value={finalReport}
          onChange={(e) => {
            if (!isEditable) return;
            setManualReportDraft(e.target.value);
          }}
          readOnly={!isEditable}
          className="w-[700px] h-[560px] bg-white border border-blue-200 px-2 pb-0.5 pt-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:bg-white"
        />
        {isEditable ? (
          <p className="absolute left-3 -bottom-6 text-sm text-blue-900">
            {isSavingManualReportDraft
              ? "Guardando informe..."
              : "Informe listo"}
          </p>
        ) : null}
      </div>
    </>
  );
}
