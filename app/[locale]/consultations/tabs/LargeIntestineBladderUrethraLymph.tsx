import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { useTranslations } from "next-intl";

export default function LargeIntestineBladderUrethraLymph() {
  const t = useTranslations("ConsultationTabs");

  const {
    formConsultation,
    setFieldConsultation,
    isSavingConsultation,
    statusMessageConsultation,
  } = useConsultationForm();

  // FUNCTION FOR FORMAT TEXT FOR DISPLAY
  const SEP = "\u{241F}"; // separador invisible

  function formatForDisplay(text: string) {
    return text.replaceAll(SEP, ", "); // separador visible para el usuario
  }

  return (
    <>
      {/* =========== Main content =========== */}
      <div className="min-h-0 ml-6 flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[650px] flex flex-col gap-1">
          <ConsultLabeledTextarea
            categoryKey="colon"
            value={formatForDisplay(formConsultation?.colon ?? "")}
            onChange={(e) => setFieldConsultation("colon", e.target.value)}
          >
            {t("colon")}
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="urinary_bladder"
            value={formatForDisplay(formConsultation?.urinary_bladder ?? "")}
            onChange={(e) =>
              setFieldConsultation("urinary_bladder", e.target.value)
            }
          >
            {t("urinaryBladder")}
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="urethra"
            value={formatForDisplay(formConsultation?.urethra ?? "")}
            onChange={(e) => setFieldConsultation("urethra", e.target.value)}
          >
            {t("urethra")}
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="lymph_nodes"
            value={formatForDisplay(formConsultation?.lymph_nodes ?? "")}
            onChange={(e) =>
              setFieldConsultation("lymph_nodes", e.target.value)
            }
          >
            {t("lymphNodes")}
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="colon_notes"
            value={formatForDisplay(formConsultation?.colon_notes ?? "")}
            onChange={(e) =>
              setFieldConsultation("colon_notes", e.target.value)
            }
          >
            {t("longPhraseOrTemplate")}
          </ConsultLabeledTextarea>

          {/* ======== Saving and status messages ======== */}
          <div className="h-5 mt-2 flex justify-center items-center">
            {isSavingConsultation && (
              <p className="text-sm text-blue-600">{t("saving")}</p>
            )}
            {statusMessageConsultation && (
              <h3 className="text-sm text-green-700">
                {statusMessageConsultation}
              </h3>
            )}
          </div>
        </div>

        {/* =========== Editable select list section ============ */}
        <div className="w-[650px]">
          <EditableSelectList
            setFieldConsultation={setFieldConsultation}
          />{" "}
        </div>
      </div>
    </>
  );
}
