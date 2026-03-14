"use client";

import LabeledInput from "@/components/LabeledInput";
import { FormErrors } from "@/hooks/usePetForm";
import { Database } from "@/types/database";

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
  if (!selectedPet) return null;

  return (
    <div className="flex flex-col gap-4">
      <LabeledInput
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.owner ?? ""}
        onChange={(e) => setField("owner", e.target.value)}
      >
        Propietario:
      </LabeledInput>
      {errors.owner && <p className="text-red-500 text-sm">{errors.owner}</p>}

      <LabeledInput
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.name ?? ""}
        onChange={(e) => setField("name", e.target.value)}
      >
        Mascota:
      </LabeledInput>
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <LabeledInput
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.referred_by ?? ""}
        onChange={(e) => setField("referred_by", e.target.value)}
      >
        Referido por:
      </LabeledInput>

      <LabeledInput
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.species ?? ""}
        onChange={(e) => setField("species", e.target.value)}
      >
        Especie:
      </LabeledInput>
      <LabeledInput
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.breed ?? ""}
        onChange={(e) => setField("breed", e.target.value)}
      >
        Raza:
      </LabeledInput>
      <LabeledInput
        labelClassName="w-26"
        inputClassName="w-75 bg-white border p-1"
        value={selectedPet?.sex ?? ""}
        onChange={(e) => setField("sex", e.target.value)}
      >
        Sexo:
      </LabeledInput>

      {statusMessage && <p className="text-green-600">{statusMessage}</p>}
    </div>
  );
}
