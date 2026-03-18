import PetImage from "@/app/dashboard/_components/PetImage";
import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import LabeledInput from "@/components/LabeledInput";

export default function PetDetailsAndReason() {
  return (
    <>
      {/* =========== Main content =========== */}
      <div className="ml-6 flex flex-row gap-4">
        {/* ======== Pet and consultation details section ========== */}
        <div className="flex flex-col gap-2">
          {/* ========== Pet form and image ========== */}
          <div className="flex flex-row gap-2">
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

              <div>
                <LabeledInput
                  labelClassName="w-28 font-bold"
                  inputClassName="w-80 bg-white"
                >
                  Referido por:
                </LabeledInput>
              </div>
            </div>
            {/* =========== Pet image ========== */}
            <div className="ml-2">
              <PetImage />
            </div>
          </div>

          {/* =========== Consultation form ============ */}
          <div className="mt-6 flex flex-col gap-4">
            <ConsultLabeledTextarea>
              MOTIVO DEL EXAMEN ECOGRÁFICO
            </ConsultLabeledTextarea>
            <ConsultLabeledTextarea>EQUIPO UTILIZADO</ConsultLabeledTextarea>
          </div>
        </div>

        {/* =========== Editable select list section ============ */}
        <div className="w-[620px]">
          <EditableSelectList />
        </div>
      </div>
    </>
  );
}
