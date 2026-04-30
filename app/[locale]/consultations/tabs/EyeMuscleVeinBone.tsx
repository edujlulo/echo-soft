import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import React from "react";
import { useTranslations } from "next-intl";

export default function EyeMuscleVeinBone() {
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
            categoryKey="ocular_study"
            value={formatForDisplay(formConsultation?.ocular_study ?? "")}
            onChange={(e) =>
              setFieldConsultation("ocular_study", e.target.value)
            }
          >
            {t("ocularStudy")}
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="muscular_study"
            value={formatForDisplay(formConsultation?.muscular_study ?? "")}
            onChange={(e) =>
              setFieldConsultation("muscular_study", e.target.value)
            }
          >
            {t("muscularStudy")}
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="thorax_lungs"
            value={formatForDisplay(formConsultation?.thorax_lungs ?? "")}
            onChange={(e) =>
              setFieldConsultation("thorax_lungs", e.target.value)
            }
          >
            {t("thoraxLungs")}
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="bones_others"
            value={formatForDisplay(formConsultation?.bones_others ?? "")}
            onChange={(e) =>
              setFieldConsultation("bones_others", e.target.value)
            }
          >
            {t("bonesOthers")}
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="ocular_notes"
            value={formatForDisplay(formConsultation?.ocular_notes ?? "")}
            onChange={(e) =>
              setFieldConsultation("ocular_notes", e.target.value)
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
          <EditableSelectList setFieldConsultation={setFieldConsultation} />
        </div>
      </div>
    </>
  );
}
