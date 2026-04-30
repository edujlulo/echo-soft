"use client";

import LabeledInput from "@/components/LabeledInput";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { useConsultationPetForm } from "@/hooks/useConsultationPetForm";
import { useTranslations } from "next-intl";

export default function MedicalHistoryPetInfoForm() {
  const t = useTranslations("MedicalHistory");

  const activeVet = useActiveVetStore((s) => s.activeVet);
  const selectedPet = useSelectedPetStore((s) => s.selectedPet);

  const { formConsultation } = useConsultationForm();

  const { calculateAge } = useConsultationPetForm();

  return (
    <>
      <div className="flex flex-row gap-2">
        {/* ===== PET, OWNER AND VETERINARIAN ====== */}
        <div className="flex flex-col gap-1">
          <LabeledInput
            labelClassName="font-bold w-32"
            inputClassName="w-80 bg-white"
            value={selectedPet?.name}
          >
            {t("pet")}
          </LabeledInput>
          <LabeledInput
            labelClassName="font-bold w-32"
            inputClassName="w-80 bg-white"
            value={selectedPet?.owner}
          >
            {t("owner")}
          </LabeledInput>
          <LabeledInput
            labelClassName="font-bold w-32"
            inputClassName="w-80 bg-white"
            value={activeVet?.name}
          >
            {t("veterinarian")}
          </LabeledInput>
        </div>

        {/* ====== SEX, SPECIES AND WEIGHT ======= */}
        <div className="flex flex-col gap-1">
          <LabeledInput
            labelClassName="font-bold"
            inputClassName="w-40 bg-white"
            value={selectedPet?.sex ?? ""}
            // onChange={(e) => setField("sex", e.target.value)}
          >
            {t("sex")}
          </LabeledInput>
          <LabeledInput
            labelClassName="font-bold"
            inputClassName="w-30 bg-white"
            value={selectedPet?.species ?? ""}
            // onChange={(e) => setField("species", e.target.value)}
          >
            {t("species")}
          </LabeledInput>
          <div className="flex flex-row gap-2">
            <LabeledInput
              labelClassName="font-bold"
              inputClassName="w-20 bg-white"
              value={selectedPet?.weight ?? ""}
              // onChange={(e) => setField("weight", e.target.value)}
            >
              {t("weight")}
            </LabeledInput>
            <p className="font-bold text-sm text-blue-950 flex justify-center items-center">
              Kg.
            </p>
          </div>
        </div>

        {/* ====== AGE, BREED AND DATE ====== */}
        <div className="flex flex-col gap-1">
          <LabeledInput
            labelClassName="w-26 font-bold"
            inputClassName="w-40 bg-white"
            value={calculateAge(selectedPet?.birth_date ?? undefined)}
            disabled
          >
            {t("age")}
          </LabeledInput>
          <LabeledInput
            labelClassName="w-26 font-bold"
            inputClassName="w-40 bg-white"
            value={selectedPet?.breed ?? ""}
            // onChange={(e) => setField("breed", e.target.value)}
          >
            {t("breed")}
          </LabeledInput>
          <LabeledInput
            labelClassName="w-26 font-bold"
            inputClassName="w-40 bg-white"
            type="Date"
            value={formConsultation?.consultation_date}
            // onChange={(e) =>
            //   setFieldConsultation("consultation_date", e.target.value)
            // }
          >
            {t("date")}
          </LabeledInput>
        </div>
      </div>
    </>
  );
}
