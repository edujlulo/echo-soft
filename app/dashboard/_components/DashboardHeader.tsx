"use client";

import LabeledInput from "@/components/LabeledInput";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { Database } from "@/types/database";

export default function DashboardHeader() {
  const activeVet = useActiveVetStore((state) => state.activeVet) as
    | Database["public"]["Tables"]["veterinarians"]["Row"]
    | null;

  const { selectedPet } = useSelectedPetStore();

  return (
    <div className="mt-2 ml-6 flex flex-col gap-2 w-max">
      <div className="flex">
        <LabeledInput
          inputClassName={`w-120 ${!activeVet ? "text-red-600 font-bold" : ""}`}
          labelClassName="w-55 font-bold text-lg"
          value={activeVet ? `${activeVet.name}` : "No hay veterinario activo"}
          disabled={true}
        >
          Veterinario trabajando:
        </LabeledInput>
      </div>
      <div className="flex flex-row gap-6">
        <LabeledInput
          inputClassName="w-70"
          labelClassName="w-20 font-bold text-lg"
          value={selectedPet?.name}
          disabled={true}
        >
          Mascota
        </LabeledInput>
        <LabeledInput
          inputClassName="w-110"
          labelClassName="w-28 font-bold text-lg"
          value={selectedPet?.owner}
          disabled={true}
        >
          Propietario
        </LabeledInput>
      </div>
    </div>
  );
}
