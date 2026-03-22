import LabeledInput from "@/components/LabeledInput";
import { useSelectedConsultationStore } from "@/context/consultationStore";
import { Database } from "@/types/database";

type PetUpdate = Database["public"]["Tables"]["pets"]["Update"];
type NewPet = Omit<
  Database["public"]["Tables"]["pets"]["Row"],
  "pet_id" | "record_number"
> &
  Partial<
    Pick<
      Database["public"]["Tables"]["pets"]["Row"],
      "pet_id" | "record_number"
    >
  >;
type SelectedPet = Database["public"]["Tables"]["pets"]["Row"] | NewPet;

type SetFieldFn = (field: keyof PetUpdate, value: string | null) => void;

type ConsultationPetFormProps = {
  selectedPet: SelectedPet | null;
  setField: SetFieldFn;
  isSaving: boolean;
  statusMessage: string | null;
  calculateAge: (birthDateStr: string | undefined) => string;
};

export default function ConsultationPetForm({
  selectedPet,
  setField,
  isSaving,
  statusMessage,
  calculateAge,
}: ConsultationPetFormProps) {
  const { selectedConsultation } = useSelectedConsultationStore();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          {/* Left section */}
          <div className="flex flex-col gap-2">
            <LabeledInput
              labelClassName="font-bold"
              inputClassName="w-40 bg-white"
              value={selectedPet?.sex ?? ""}
              onChange={(e) => setField("sex", e.target.value)}
            >
              Sexo:
            </LabeledInput>
            <LabeledInput
              labelClassName="font-bold"
              inputClassName="w-30 bg-white"
              value={selectedPet?.species ?? ""}
              onChange={(e) => setField("species", e.target.value)}
            >
              Especie:
            </LabeledInput>
            <div className="flex flex-row gap-2">
              <LabeledInput
                labelClassName="font-bold"
                inputClassName="w-20 bg-white"
                value={selectedPet?.weight ?? ""}
                onChange={(e) => setField("weight", e.target.value)}
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
              type="date"
              value={selectedPet?.birth_date ?? ""}
              onChange={(e) => setField("birth_date", e.target.value)}
            >
              Fecha de nacimiento:
            </LabeledInput>
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
              onChange={(e) => setField("breed", e.target.value)}
            >
              Raza:
            </LabeledInput>
            <LabeledInput
              labelClassName="w-26 font-bold"
              inputClassName="w-40 bg-white"
              type="Date"
              disabled
              value={selectedConsultation?.consultation_date}
            >
              Fecha:
            </LabeledInput>
          </div>
        </div>

        <div>
          <LabeledInput
            labelClassName="w-28 font-bold"
            inputClassName="w-80 bg-white"
            value={selectedPet?.referred_by ?? ""}
            onChange={(e) => setField("referred_by", e.target.value)}
          >
            Referido por:
          </LabeledInput>
        </div>

        {/* ======== Saving and status messages ======== */}
        <div className="h-5 mt-2 flex justify-center items-center">
          {isSaving && <p className="text-sm text-blue-600">Guardando...</p>}
          {statusMessage && (
            <h3 className="text-sm text-green-700">{statusMessage}</h3>
          )}
        </div>
      </div>
    </>
  );
}
