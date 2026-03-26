import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import { useConsultationForm } from "@/hooks/useConsultationForm";

export default function AdrenalUterusOvaries() {
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
      <div className="ml-6 flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[650px] -mt-2 flex flex-col gap-1">
          <ConsultLabeledTextarea
            categoryKey="adrenal_glands"
            value={formatForDisplay(formConsultation?.adrenal_glands ?? "")}
            onChange={(e) =>
              setFieldConsultation("adrenal_glands", e.target.value)
            }
          >
            GLÁNDULAS ADRENALES
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="uterus"
            value={formatForDisplay(formConsultation?.uterus ?? "")}
            onChange={(e) => setFieldConsultation("uterus", e.target.value)}
          >
            ÚTERO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="ovaries"
            value={formatForDisplay(formConsultation?.ovaries ?? "")}
            onChange={(e) => setFieldConsultation("ovaries", e.target.value)}
          >
            OVARIOS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="thyroid_glands"
            value={formatForDisplay(formConsultation?.thyroid_glands ?? "")}
            onChange={(e) =>
              setFieldConsultation("thyroid_glands", e.target.value)
            }
          >
            GLÁNDULAS TIROIDES
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="uterus_notes"
            value={formatForDisplay(formConsultation?.uterus_notes ?? "")}
            onChange={(e) =>
              setFieldConsultation("uterus_notes", e.target.value)
            }
          >
            FRASE LARGA O PLANTILLA
          </ConsultLabeledTextarea>

          {/* ======== Saving and status messages ======== */}
          <div className="h-5 mt-2 flex justify-center items-center">
            {isSavingConsultation && (
              <p className="text-sm text-blue-600">Guardando...</p>
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
