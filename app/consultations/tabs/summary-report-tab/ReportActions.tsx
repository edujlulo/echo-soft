import Button from "@/components/Button";
import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useConsultationStore } from "@/context/consultationStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useClinicImage } from "@/hooks/useClinicImage";
import { useFinalReport } from "@/hooks/useFinalReport";
import { usePetImages } from "@/hooks/usePetImages";
import { useState } from "react";
import { fetchUltrasoundImagesByConsultation } from "@/lib/queries/ultrasoundImages";
import ReportPreviewDialog from "./ReportPreviewDialog";

interface Props {
  setIsQuickModeOpen: (open: boolean) => void;
}

export default function ReportActions({ setIsQuickModeOpen }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);

  const { finalReport } = useFinalReport();
  const formConsultation = useConsultationStore((s) => s.formConsultation);
  const consultationId = useConsultationStore(
    (s) => s.selectedConsultation?.consultation_id
  );
  const selectedPet = useSelectedPetStore((s) => s.selectedPet);
  const activeVet = useActiveVetStore((s) => s.activeVet);
  const activeClinic = useClinicStore((s) => s.activeClinic);
  const { image } = useClinicImage();
  const { images } = usePetImages();

  const reportActionsButtonsClassName =
    "font-bold bg-green-200 border-green-400 hover:bg-green-300 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500";

  // Download PDF report
  type PdfLayoutMode = "grid-6" | "single";

  const handleDownloadPDF = async (layoutMode: PdfLayoutMode = "grid-6") => {
    try {
      setIsDownloading(true);

      const ultrasoundImages = consultationId
        ? await fetchUltrasoundImagesByConsultation(consultationId)
        : [];

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report: finalReport,
          formConsultation,
          selectedPet,
          activeVet,
          activeClinic,
          image,
          images,
          ultrasoundImages,
          ultrasoundLayout: layoutMode,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to generate PDF:", errorText);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        layoutMode === "single"
          ? "Ecosoft-report-1-image-per-page.pdf"
          : "Ecosoft-report.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDFSixPerPage = () => {
    handleDownloadPDF("grid-6");
  };

  const handleDownloadPDFOnePerPage = () => {
    handleDownloadPDF("single");
  };

  // Open report preview dialog
  const handlePreviewPDF = () => {
    setIsReportPreviewOpen(true);
  };
  // const handlePreviewPDF = () => {
  //   window.open("/report-preview", "_blank", "noopener,noreferrer");
  // };

  return (
    <>
      <div className="mt-6 flex flex-row gap-2 ">
        <div className="ml-3 flex">
          <Button
            onClick={handlePreviewPDF}
            className={reportActionsButtonsClassName}
          >
            Vista previa del PDF
          </Button>
        </div>
        <Button
          onClick={handleDownloadPDFSixPerPage}
          disabled={isDownloading}
          className={`${reportActionsButtonsClassName} ${
            isDownloading ? "opacity-50 cursor-not-allowed" : ""
          } w-72`}
        >
          {isDownloading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
              Generando PDF...
            </span>
          ) : (
            "Descargar PDF - 6 imágenes por hoja"
          )}
        </Button>
        <div className="mr-60 flex">
          <Button
            onClick={handleDownloadPDFOnePerPage}
            disabled={isDownloading}
            className={`${reportActionsButtonsClassName} ${
              isDownloading ? "opacity-50 cursor-not-allowed" : ""
            } w-72`}
          >
            {isDownloading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                Generando PDF...
              </span>
            ) : (
              "Descargar PDF - 1 imagen por hoja"
            )}
          </Button>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Button
            className={reportActionsButtonsClassName}
            onClick={() => setIsQuickModeOpen(true)}
          >
            Modo rápido
          </Button>
          {/* <Button className={reportActionsButtonsClassName}>
            Modo rápido con ayuda
          </Button>
          <Button className={reportActionsButtonsClassName}>Solo ayuda</Button> */}
        </div>
      </div>
      <ReportPreviewDialog
        isOpen={isReportPreviewOpen}
        onClose={() => setIsReportPreviewOpen(false)}
        report={finalReport}
      />
    </>
  );
}
