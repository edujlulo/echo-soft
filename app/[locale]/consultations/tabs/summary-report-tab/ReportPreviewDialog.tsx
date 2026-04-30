"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { useConsultationStore } from "@/context/consultationStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useClinicStore } from "@/context/activeClinicStore";
import { useClinicImage } from "@/hooks/useClinicImage";
import { usePetImages } from "@/hooks/usePetImages";
import { reportPdfTemplate } from "@/reports/templates/reportPdfTemplate";
import { fetchUltrasoundImagesByConsultation } from "@/lib/queries/ultrasoundImages";
import type { UltrasoundImageListItem } from "@/lib/queries/ultrasoundImages";
import DialogScaleWrapper from "@/components/DialogScaleWrapper";
import { useTranslations } from "next-intl";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  report: string;
}

export default function ReportPreviewDialog({
  isOpen,
  onClose,
  report,
}: Props) {
  const t = useTranslations("SummaryReportTab");

  const formConsultation = useConsultationStore((s) => s.formConsultation);
  const consultationId = useConsultationStore(
    (s) => s.selectedConsultation?.consultation_id,
  );
  const selectedPet = useSelectedPetStore((s) => s.selectedPet);
  const activeVet = useActiveVetStore((s) => s.activeVet);
  const activeClinic = useClinicStore((s) => s.activeClinic);

  const { image } = useClinicImage();
  const { images } = usePetImages();

  const [ultrasoundImages, setUltrasoundImages] = useState<
    UltrasoundImageListItem[]
  >([]);

  useEffect(() => {
    let isMounted = true;

    async function loadUltrasoundImages() {
      if (!isOpen) return;

      if (!consultationId) {
        if (isMounted) {
          setUltrasoundImages([]);
        }
        return;
      }

      try {
        const fetchedImages =
          await fetchUltrasoundImagesByConsultation(consultationId);

        if (isMounted) {
          setUltrasoundImages(fetchedImages);
        }
      } catch (error) {
        console.error("Failed to load ultrasound images for preview:", error);

        if (isMounted) {
          setUltrasoundImages([]);
        }
      }
    }

    void loadUltrasoundImages();

    return () => {
      isMounted = false;
    };
  }, [isOpen, consultationId]);

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
      ultrasoundImages,
    });
  }, [
    report,
    formConsultation,
    selectedPet,
    activeVet,
    activeClinic,
    image,
    images,
    ultrasoundImages,
  ]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex overflow-y-auto overflow-x-auto"
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <DialogScaleWrapper
        baseWidth={1000}
        baseHeight={780}
        minScale={0.8}
        className="m-auto"
      >
        <Dialog.Panel className="w-[1000px] h-[780px] flex flex-col flex-shrink-0 bg-gray-100 rounded-md z-50 border border-gray-500 shadow-lg relative m-auto">
          <button
            type="button"
            onClick={onClose}
            className="pt-0.5 absolute top-2 right-2 w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md border border-gray-500 transition-colors text-2xl"
            aria-label={t("closePreview")}
          >
            ×
          </button>

          <div className="w-full flex-shrink-0">
            <Navbar>{t("reportPreview")}</Navbar>
          </div>

          <div className="flex-1 min-h-0 p-4 flex flex-col">
            <div className="flex-1 min-h-0 overflow-auto flex justify-center">
              <div className="w-[210mm] min-h-full bg-white border shadow p-6">
                <iframe
                  title={t("reportPreviewIframeTitle")}
                  srcDoc={reportHtml}
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Button
                type="button"
                onClick={onClose}
                className="w-32 font-bold bg-green-300 border border-gray-50 hover:bg-green-400"
              >
                {t("close")}
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </DialogScaleWrapper>
    </Dialog>
  );
}
