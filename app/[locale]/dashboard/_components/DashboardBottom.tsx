"use client";

import Button from "@/components/Button";
import ConsultationsButtons from "./ConsultationsButtons";
import PetButtons from "./PetButtons";
import PetImage from "./PetImage";
import SummaryFields from "./SummaryFields";
import ConsultationsTable from "./ConsultationsTable";
import { useConsultations } from "@/hooks/useConsultations";
import { useTranslations } from "next-intl";

export default function DashboardBottom() {
  const t = useTranslations("DashboardBottom");
  const {
    consultationsByPet,
    loadingConsultations,
    addConsultation,
    deleteConsultation,
    isDeletingConsultation,
  } = useConsultations();

  return (
    <div className="-mt-1.5 h-full flex justify-end">
      <div className="w-full flex flex-row gap-2 ">
        {/* ======= PET IMAGE ======= */}
        <div className="px-4 py-4 flex items-center flex-col gap-2">
          <p className="py-0.5 px-2 font-bold text-xl bg-gray-300">{t("pet")}</p>
          <PetImage />
        </div>

        {/* Central section */}
        <div className="w-full h-full flex flex-col gap-1 items-center justify-center">
          {/* ====== COMPARATIVE BUTTON ======== */}
          <div>{/* <Button>Comparativo 1</Button> */}</div>
          <div className="w-full flex flex-row gap-4 justify-center items-center">
            {/* ======= PET BUTTONS ======= */}
            <PetButtons />

            {/* ======= CONSULTATIONS TABLE ======= */}
            <div className="w-full h-full flex-1 mr-20 flex justify-center items-start">
              <ConsultationsTable
                consultationsByPet={consultationsByPet}
                loadingConsultations={loadingConsultations}
              />
            </div>
          </div>

          {/* ======== SUMMARY SECTION ======== */}
          <div className="w-full ml-7">
            <SummaryFields />
          </div>
        </div>

        {/* ========= CONSULTATIONS BUTTONS ======== */}
        <div className="mt-10 mr-10 flex">
          <ConsultationsButtons
            addConsultation={addConsultation}
            deleteConsultation={deleteConsultation}
            isDeletingConsultation={isDeletingConsultation}
          />
        </div>
      </div>
    </div>
  );
}
