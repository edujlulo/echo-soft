"use client";

import { useMemo } from "react";
import { useConsultationStore } from "@/context/consultationStore";
import { reportPdfTemplate } from "@/reports/templates/reportPdfTemplate";
import { useConsultationReportBuilder } from "@/hooks/useConsultationReportBuilder";

export default function ReportPreviewPage() {
  const { report } = useConsultationReportBuilder();

  const reportHtml = useMemo(() => {
    if (!report) return "";

    return reportPdfTemplate(report);
  }, [report]);

  return (
    <div className="w-full h-screen p-4 bg-gray-100">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Preview del PDF (HTML)</h2>
        <p className="text-sm text-gray-600">
          Este es el diseño que se usará para generar el PDF
        </p>
      </div>

      <div className="w-full h-[90%] flex justify-center overflow-auto">
        <div className="w-[210mm] bg-white border shadow p-8">
          {" "}
          <iframe
            title="Report Preview"
            srcDoc={reportHtml}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
