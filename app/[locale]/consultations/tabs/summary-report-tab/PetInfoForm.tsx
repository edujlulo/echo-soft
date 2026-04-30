import PetImage from "@/app/[locale]/dashboard/_components/PetImage";
import LabeledInput from "@/components/LabeledInput";
import PetInfoFormActions from "./PetInfoFormActions";
import { Database } from "@/types/database";
import { useConsultationStore } from "@/context/consultationStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { buildSuggestedPdfName } from "@/reports/pdfNameUtils";
import { useEffect, useMemo } from "react";
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
type CalculateAgeFn = (birthDateStr: string | undefined) => string;

interface PetDetailsAndReasonProps {
  selectedPet: SelectedPet | null;
  setField: SetFieldFn;
  isSaving: boolean;
  statusMessage: string | null;
  calculateAge: CalculateAgeFn;
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
}

export default function PetInfoForm({
  selectedPet,
  setField,
  isSaving,
  statusMessage,
  calculateAge,
  setIsFullTemplatesDialogOpen,
}: PetDetailsAndReasonProps) {
  const t = useTranslations("SummaryReportTab");

  const { selectedConsultation } = useConsultationStore();

  const {
    formConsultation,
    setFieldConsultation,
    isSavingConsultation,
    statusMessageConsultation,
  } = useConsultationForm();

  const suggestedPdfName = useMemo(
    () => buildSuggestedPdfName(selectedPet, formConsultation),
    [selectedPet?.name, selectedPet?.owner, formConsultation?.consultation_date]
  );

  useEffect(() => {
    if (!formConsultation) return;
    if (formConsultation.suggested_pdf_name?.trim()) return;
    if (!suggestedPdfName) return;

    setFieldConsultation("suggested_pdf_name", suggestedPdfName);
  }, [
    formConsultation?.consultation_id,
    formConsultation?.suggested_pdf_name,
    suggestedPdfName,
    setFieldConsultation,
  ]);

  return (
    <>
      {/* ========== Pet info form and image ========== */}
      <div className="flex flex-col gap-2">
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
                value={selectedPet?.sex ?? ""}
                onChange={(e) => setField("sex", e.target.value)}
              >
                {t("sex")}
              </LabeledInput>
              <LabeledInput
                labelClassName="font-bold"
                inputClassName="w-30 bg-white"
                value={selectedPet?.species ?? ""}
                onChange={(e) => setField("species", e.target.value)}
              >
                {t("species")}
              </LabeledInput>
              <div className="flex flex-row gap-2">
                <LabeledInput
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
                labelClassName="w-26 font-bold"
                inputClassName="w-40 bg-white"
                type="date"
                value={selectedPet?.birth_date ?? ""}
                onChange={(e) => setField("birth_date", e.target.value)}
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
                labelClassName="w-26 font-bold"
                inputClassName="w-40 bg-white"
                value={selectedPet?.breed ?? ""}
                onChange={(e) => setField("breed", e.target.value)}
              >
                {t("breed")}
              </LabeledInput>
              <LabeledInput
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

          <LabeledInput
            labelClassName="w-28 font-bold"
            inputClassName="w-100 bg-white"
            value={selectedPet?.referred_by ?? ""}
            onChange={(e) => setField("referred_by", e.target.value)}
          >
            {t("referredBy")}
          </LabeledInput>
          <LabeledInput
            labelClassName="w-54 font-bold"
            inputClassName="w-110 bg-white"
            forceUpperCase={false}
            value={formConsultation?.suggested_pdf_name ?? ""}
            onChange={(e) =>
              setFieldConsultation("suggested_pdf_name", e.target.value)
            }
          >
            {t("pdfDocumentName")}
          </LabeledInput>

          <LabeledInput
            labelClassName="w-37 font-bold"
            inputClassName="w-110 bg-white"
            value={formConsultation?.report_title ?? ""}
            onChange={(e) =>
              setFieldConsultation("report_title", e.target.value)
            }
          >
            {t("reportTitle")}
          </LabeledInput>

          {/* ======= Actions buttons ========= */}
          <div>
            <PetInfoFormActions
              setIsFullTemplatesDialogOpen={setIsFullTemplatesDialogOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
}
