"use client";

import { useMemo } from "react";
import { useConsultationStore } from "@/context/consultationStore";
import { reportPdfTemplate } from "@/reports/templates/reportPdfTemplate";
import { useConsultationReportBuilder } from "@/hooks/useConsultationReportBuilder";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useClinicStore } from "@/context/activeClinicStore";
import { useClinicImage } from "@/hooks/useClinicImage";
import { usePetImages } from "@/hooks/usePetImages";

export default function ReportPreviewPage() {
  const { report } = useConsultationReportBuilder();
  const formConsultation = useConsultationStore((s) => s.formConsultation);
  const selectedPet = useSelectedPetStore((s) => s.selectedPet);
  const activeVet = useActiveVetStore((s) => s.activeVet);
  const activeClinic = useClinicStore((s) => s.activeClinic);

  const { image } = useClinicImage();
  const { images } = usePetImages();

  const reportHtml = useMemo(() => {
    if (!report) return "";

    return reportPdfTemplate({
      report,
      formConsultation,
      selectedPet,
      activeVet,
      activeClinic,
      image,
      images: {
        profile: images.profile ?? undefined,
      },
    });
  }, [
    report,
    formConsultation,
    selectedPet,
    activeVet,
    activeClinic,
    image,
    images,
  ]);

  return (
    <div className="w-full h-screen p-4 bg-gray-100">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Vista previa del informe</h2>
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
