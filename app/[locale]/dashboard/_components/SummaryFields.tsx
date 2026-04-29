"use client";

import LabeledInput from "@/components/LabeledInput";
import { usePetsStore } from "@/context/petsStore";
import { useTranslations } from "next-intl";

export default function SummaryFields() {
  const pets = usePetsStore((s) => s.pets);

  const t = useTranslations("SummaryFields");

  return (
    <div className="my-1 flex flex-row gap-4 font-bold">
      <p className="px-2 py-0.5 bg-gray-300 font-bold text-xl">
        {" "}
        {t("summary")}
      </p>
      <LabeledInput
        inputClassName="w-20"
        labelClassName="w-30"
        value={pets.length}
      >
        {t("totalPatients")}
      </LabeledInput>
      <LabeledInput inputClassName="w-20" labelClassName="w-25">
        {t("groupTotal")}
      </LabeledInput>
      <LabeledInput inputClassName="w-20" labelClassName="w-28">
        {t("percentage")}
      </LabeledInput>
    </div>
  );
}
