import PetImage from "@/app/dashboard/_components/PetImage";
import LabeledInput from "@/components/LabeledInput";
import PetInfoFormActions from "./PetInfoFormActions";

export default function PetInfoForm() {
  return (
    <>
      {/* ========== Pet info form and image ========== */}
      <div className="-mt-4 flex flex-col gap-2">
        {/* =========== Pet image ========== */}
        <div className="ml-2">
          <PetImage />
        </div>
        {/* ========= Pet form ========== */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            {/* Left section */}
            <div className="flex flex-col gap-2">
              <LabeledInput
                labelClassName="font-bold"
                inputClassName="w-40 bg-white"
              >
                Sexo:
              </LabeledInput>
              <LabeledInput
                labelClassName="font-bold"
                inputClassName="w-30 bg-white"
              >
                Especie:
              </LabeledInput>
              <div className="flex flex-row gap-2">
                <LabeledInput
                  labelClassName="font-bold"
                  inputClassName="w-20 bg-white"
                >
                  Peso:
                </LabeledInput>
                <p className="font-bold text-sm text-blue-950 flex justify-center items-center">
                  Kg.
                </p>
              </div>
            </div>

            {/* Right section */}

            <div className="flex flex-col gap-2">
              <LabeledInput
                labelClassName="w-26 font-bold"
                inputClassName="w-40 bg-white"
              >
                Fecha de nacimiento:
              </LabeledInput>
              <LabeledInput
                labelClassName="w-26 font-bold"
                inputClassName="w-40 bg-white"
              >
                Edad:
              </LabeledInput>
              <LabeledInput
                labelClassName="w-26 font-bold"
                inputClassName="w-40 bg-white"
              >
                Raza:
              </LabeledInput>
              <LabeledInput
                labelClassName="w-26 font-bold"
                inputClassName="w-40 bg-white"
              >
                Fecha:
              </LabeledInput>
            </div>
          </div>

          <LabeledInput
            labelClassName="w-28 font-bold"
            inputClassName="w-100 bg-white"
          >
            Referido por:
          </LabeledInput>
          <LabeledInput
            labelClassName="w-56 font-bold"
            inputClassName="w-110 bg-white"
          >
            Nombre suferido para el PDF:
          </LabeledInput>
          <LabeledInput
            labelClassName="w-37 font-bold"
            inputClassName="w-110 bg-white"
          >
            Título del informe:
          </LabeledInput>

          {/* ======= Actions buttons ========= */}
          <div>
            <PetInfoFormActions />
          </div>
        </div>
      </div>
    </>
  );
}
