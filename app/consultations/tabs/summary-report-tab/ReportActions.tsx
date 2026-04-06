import Button from "@/components/Button";
import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useConsultationStore } from "@/context/consultationStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useClinicImage } from "@/hooks/useClinicImage";
import { useConsultationReportBuilder } from "@/hooks/useConsultationReportBuilder";
import { usePetImages } from "@/hooks/usePetImages";
import { useRouter } from "next/navigation";

interface Props {
  setIsQuickModeOpen: (open: boolean) => void;
}

export default function ReportActions({ setIsQuickModeOpen }: Props) {
  const router = useRouter();

  const { report } = useConsultationReportBuilder();
  const formConsultation = useConsultationStore((s) => s.formConsultation);
  const selectedPet = useSelectedPetStore((s) => s.selectedPet);
  const activeVet = useActiveVetStore((s) => s.activeVet);
  const activeClinic = useClinicStore((s) => s.activeClinic);
  const { image } = useClinicImage();
  const { images } = usePetImages();

  const reportActionsButtonsClassName =
    "font-bold bg-green-200 border-green-400 hover:bg-green-300 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500";

  // Download PDF report
  const handleDownloadPDF = async () => {
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        report,
        formConsultation,
        selectedPet,
        activeVet,
        activeClinic,
        image,
        images,
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
    a.download = "Ecosoft-report.pdf";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // Navigate to PDF report preview
  const handlePreviewPDF = () => {
    router.push("/report-preview");
  };
  // const handlePreviewPDF = () => {
  //   window.open("/report-preview", "_blank", "noopener,noreferrer");
  // };

  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="ml-10 flex flex-col gap-1">
          <Button className={reportActionsButtonsClassName}>
            Sumario carta
          </Button>
          <Button className={reportActionsButtonsClassName}>
            Sumario oficio
          </Button>
        </div>
        <div className="mr-105 flex flex-col gap-1">
          <Button className={reportActionsButtonsClassName}>
            Una imagen por hoja
          </Button>
          <Button className={reportActionsButtonsClassName}>
            Una imagen por hoja
          </Button>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Button
            onClick={handleDownloadPDF}
            className={reportActionsButtonsClassName}
          >
            Descargar PDF
          </Button>
          <Button
            onClick={handlePreviewPDF}
            className={reportActionsButtonsClassName}
          >
            Vista previa del PDF
          </Button>
          <Button
            className={reportActionsButtonsClassName}
            onClick={() => setIsQuickModeOpen(true)}
          >
            Modo rápido
          </Button>
          <Button className={reportActionsButtonsClassName}>
            Modo rápido con ayuda
          </Button>
          <Button className={reportActionsButtonsClassName}>Solo ayuda</Button>
        </div>
      </div>
    </>
  );
}
