"use client";

import LabeledInput from "@/components/LabeledInput";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { useConsultationPetForm } from "@/hooks/useConsultationPetForm";

export default function MedicalHistoryPetInfoForm() {
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
            labelClassName="font-bold w-29"
            inputClassName="w-80 bg-white"
            value={selectedPet?.name}
          >
            MASCOTA:
          </LabeledInput>
          <LabeledInput
            labelClassName="font-bold w-29"
            inputClassName="w-80 bg-white"
            value={selectedPet?.owner}
          >
            PROPIETARIO:
          </LabeledInput>
          <LabeledInput
            labelClassName="font-bold w-29"
            inputClassName="w-80 bg-white"
            value={activeVet?.name}
          >
            VETERINARIO:
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
            Sexo:
          </LabeledInput>
          <LabeledInput
            labelClassName="font-bold"
            inputClassName="w-30 bg-white"
            value={selectedPet?.species ?? ""}
            // onChange={(e) => setField("species", e.target.value)}
          >
            Especie:
          </LabeledInput>
          <div className="flex flex-row gap-2">
            <LabeledInput
              labelClassName="font-bold"
              inputClassName="w-20 bg-white"
              value={selectedPet?.weight ?? ""}
              // onChange={(e) => setField("weight", e.target.value)}
            >
              Peso:
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
            Edad:
          </LabeledInput>
          <LabeledInput
            labelClassName="w-26 font-bold"
            inputClassName="w-40 bg-white"
            value={selectedPet?.breed ?? ""}
            // onChange={(e) => setField("breed", e.target.value)}
          >
            Raza:
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
            Fecha:
          </LabeledInput>
        </div>
      </div>
    </>
  );
}
