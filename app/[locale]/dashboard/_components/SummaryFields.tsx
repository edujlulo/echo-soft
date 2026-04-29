"use client";

import LabeledInput from "@/components/LabeledInput";
import { usePetsStore } from "@/context/petsStore";

export default function SummaryFields() {
  const pets = usePetsStore((s) => s.pets);

  return (
    <div className="my-1 flex flex-row gap-4 font-bold">
      <p className="px-2 py-0.5 bg-gray-300 font-bold text-xl">RESUMEN</p>
      <LabeledInput
        inputClassName="w-20"
        labelClassName="w-30"
        value={pets.length}
      >
        Total Mascotas
      </LabeledInput>
      <LabeledInput inputClassName="w-20" labelClassName="w-25">
        Total Grupo
      </LabeledInput>
      <LabeledInput inputClassName="w-20" labelClassName="w-28">
        Porcentaje %
      </LabeledInput>
    </div>
  );
}
