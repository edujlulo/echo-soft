"use client";

import LabeledInput from "@/components/LabeledInput";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import { FormErrors } from "@/hooks/usePetForm";
import { Database } from "@/types/database";
import { useTranslations } from "next-intl";

type Pet = Database["public"]["Tables"]["pets"]["Row"];

interface PetFormProps {
  selectedPet: Pet;
  setField: (field: keyof Pet, value: string) => void;
  errors: FormErrors;
  statusMessage: string | null;
}

export default function PetForm({
  selectedPet,
  setField,
  errors,
  statusMessage,
}: PetFormProps) {
  const t = useTranslations("PetForm");
  if (!selectedPet) return null;

  const { setActiveField } = useEditableSelectListStore();

  return (
    <div className="flex flex-col gap-4">
      <LabeledInput
        categoryKey="owner"
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.owner ?? ""}
        onChange={(e) => setField("owner", e.target.value)}
      >
        {t("owner")}
      </LabeledInput>
      {errors.owner && <p className="text-red-500 text-sm">{errors.owner}</p>}

      <LabeledInput
        resetEditableSelectListOnFocus
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.name ?? ""}
        onChange={(e) => setField("name", e.target.value)}
      >
        {t("pet")}
      </LabeledInput>
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <LabeledInput
        categoryKey="referred_by"
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.referred_by ?? ""}
        onChange={(e) => setField("referred_by", e.target.value)}
      >
        {t("referredBy")}
      </LabeledInput>

      <LabeledInput
        categoryKey="species"
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.species ?? ""}
        onChange={(e) => setField("species", e.target.value)}
      >
        {t("species")}
      </LabeledInput>

      <LabeledInput
        categoryKey="breed"
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.breed ?? ""}
        onChange={(e) => setField("breed", e.target.value)}
      >
        {t("breed")}
      </LabeledInput>

      <LabeledInput
        categoryKey="sex"
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.sex ?? ""}
        onChange={(e) => setField("sex", e.target.value)}
      >
        {t("sex")}
      </LabeledInput>

      {statusMessage && <p className="text-green-600">{statusMessage}</p>}
    </div>
  );
}
