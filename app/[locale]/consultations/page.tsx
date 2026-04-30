"use client";

import LabeledInput from "@/components/LabeledInput";
import Navbar from "@/components/Navbar";
import ConsultationTabs from "./ConsultationTabs";
import Button from "@/components/Button";
import { useParams, useRouter } from "next/navigation";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useTranslations } from "next-intl";

export default function ConsultationsPage() {
  const t = useTranslations("ConsultationTabs");

  const router = useRouter();

  const params = useParams();
  const locale = params.locale as string;

  const activeVet = useActiveVetStore((s) => s.activeVet);
  const selectedPet = useSelectedPetStore((s) => s.selectedPet);

  const navigateToDashboard = () => {
    router.push(`/${locale}/dashboard`);
  };

  return (
    <>
      <div className="w-[1600px] h-[800px] flex-1 min-h-0  bg-gray-300 flex flex-col rounded-md text-sm">
        {/* NavBar */}
        <div className="w-full">
          <Navbar>{t("pageTitle")}</Navbar>
        </div>

        {/* Contenedor principal */}
        <div className="min-h-0 flex flex-col flex-1">
          {/* Top label-inputs */}
          <div className="mx-4 my-0.5 flex flex-row gap-4">
            <LabeledInput
              labelClassName="font-bold"
              inputClassName="w-55 bg-white"
              value={selectedPet?.name}
              disabled
            >
              {t("patient")}
            </LabeledInput>
            <LabeledInput
              labelClassName="font-bold w-30"
              inputClassName="w-90 bg-white"
              value={selectedPet?.owner}
              disabled
            >
              {t("owner")}
            </LabeledInput>
            <LabeledInput
              labelClassName="font-bold w-30"
              inputClassName="w-90 bg-white"
              value={activeVet?.name}
              disabled
            >
              {t("veterinarian")}
            </LabeledInput>

            {/* Close button */}
            <div className="ml-auto mr-10">
              <Button
                onClick={navigateToDashboard}
                className="flex w-20 items-center justify-center px-3 py-1 font-bold bg-green-300 border border-gray-50 hover:bg-green-400"
              >
                {t("close")}
              </Button>
            </div>
          </div>

          {/* Consultation tabs section */}
          <div className="mb-2 flex flex-col flex-1 min-h-0 overflow-hidden">
            <ConsultationTabs />
          </div>
        </div>
      </div>
    </>
  );
}
