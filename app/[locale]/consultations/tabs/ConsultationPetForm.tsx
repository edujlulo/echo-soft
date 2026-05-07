import LabeledInput from "@/components/LabeledInput";
import { useConsultationStore } from "@/context/consultationStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { Database } from "@/types/database";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("ConsultationTabs");

  const { selectedConsultation } = useConsultationStore();

  const { formConsultation, setFieldConsultation } = useConsultationForm();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          {/* Left section */}
          <div className="flex flex-col gap-2">
            <LabeledInput
              categoryKey="sex"
              labelClassName="font-bold"
              inputClassName="w-40 bg-white"
              value={selectedPet?.sex ?? ""}
              onChange={(e) => setField("sex", e.target.value)}
            >
              {t("sex")}
            </LabeledInput>
            <LabeledInput
              categoryKey="species"
              labelClassName="font-bold"
              inputClassName="w-30 bg-white"
              value={selectedPet?.species ?? ""}
              onChange={(e) => setField("species", e.target.value)}
            >
              {t("species")}
            </LabeledInput>
            <div className="flex flex-row gap-2">
              <LabeledInput
                resetEditableSelectListOnFocus
                labelClassName="font-bold"
                inputClassName="w-20 bg-white"
                value={selectedPet?.weight ?? ""}
                onChange={(e) => setField("weight", e.target.value)}
              >
                {t("weight")}
              </LabeledInput>
              <p className="font-bold text-sm text-blue-950 flex justify-center items-center">
                {t("kilogramUnit")}
              </p>
            </div>
          </div>

          {/* Right section */}

          <div className="flex flex-col gap-2">
            <LabeledInput
              resetEditableSelectListOnFocus
              labelClassName="w-26 font-bold"
              inputClassName="w-40 bg-white"
              type="date"
              value={selectedPet?.birth_date ?? ""}
              onChange={(e) => setField("birth_date", e.target.value || null)}
            >
              {t("birthDate")}
            </LabeledInput>
            <LabeledInput
              labelClassName="w-26 font-bold"
              inputClassName="w-40 bg-white"
              value={calculateAge(selectedPet?.birth_date ?? undefined)}
              disabled
            >
              {t("age")}
            </LabeledInput>
            <LabeledInput
              categoryKey="breed"
              labelClassName="w-26 font-bold"
              inputClassName="w-40 bg-white"
              value={selectedPet?.breed ?? ""}
              onChange={(e) => setField("breed", e.target.value)}
            >
              {t("breed")}
            </LabeledInput>
            <LabeledInput
              resetEditableSelectListOnFocus
              labelClassName="w-26 font-bold"
              inputClassName="w-40 bg-white"
              type="date"
              value={formConsultation?.consultation_date}
              onChange={(e) =>
                setFieldConsultation("consultation_date", e.target.value)
              }
            >
              {t("date")}
            </LabeledInput>
          </div>
        </div>

        <div>
          <LabeledInput
            categoryKey="referred_by"
            labelClassName="w-28 font-bold"
            inputClassName="w-80 bg-white"
            value={selectedPet?.referred_by ?? ""}
            onChange={(e) => setField("referred_by", e.target.value)}
          >
            {t("referredBy")}
          </LabeledInput>
        </div>

        {/* ======== Saving and status messages ======== */}
        <div className="h-5 mt-2 flex justify-center items-center">
          {isSaving && <p className="text-sm text-blue-600">{t("saving")}</p>}
          {statusMessage && (
            <h3 className="text-sm text-green-700">{statusMessage}</h3>
          )}
        </div>
      </div>
    </>
  );
}
