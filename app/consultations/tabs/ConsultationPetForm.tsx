import LabeledInput from "@/components/LabeledInput";
import { useConsultationPetForm } from "@/hooks/useConsultationPetForm";

export default function ConsultationPetForm() {
  const { selectedPet, setField, isSaving, statusMessage } =
    useConsultationPetForm();

  function calculateAge(birthDateStr: string | undefined) {
    if (!birthDateStr) return "";

    const birthDate = new Date(birthDateStr);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
      months -= 1; // no ha cumplido el mes completo
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years > 0) {
      return `${years} año${years > 1 ? "s" : ""} ${months} mes${months !== 1 ? "es" : ""}`;
    } else {
      return `${months} mes${months !== 1 ? "es" : ""}`;
    }
  }

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
