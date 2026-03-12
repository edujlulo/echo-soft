"use client";

import LabeledInput from "@/components/LabeledInput";

export default function DashboardHeader() {
  return (
    <div className="mt-2 ml-6 flex flex-col gap-2 w-max">
      <div className="flex">
        <LabeledInput
          inputClassName="w-120"
          labelClassName="w-55 font-bold text-lg"
        >
          Veterinario trabajando:
        </LabeledInput>
      </div>
      <div className="flex flex-row gap-6">
        <LabeledInput
          inputClassName="w-70"
          labelClassName="w-20 font-bold text-lg"
        >
          Mascota
        </LabeledInput>
        <LabeledInput
          inputClassName="w-110"
          labelClassName="w-28 font-bold text-lg"
        >
          Propietario
        </LabeledInput>
      </div>
    </div>
  );
}
