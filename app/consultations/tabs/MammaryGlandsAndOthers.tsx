import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import { useConsultationForm } from "@/hooks/useConsultationForm";

export default function MammaryGlandsAndOthers() {
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
        <div className="w-[650px] flex flex-col gap-0.5">
          <ConsultLabeledTextarea
            categoryKey="mammary_glands"
            textareaHeight="h-18"
            value={formatForDisplay(formConsultation?.mammary_glands ?? "")}
            onChange={(e) =>
              setFieldConsultation("mammary_glands", e.target.value)
            }
          >
            GLÁNDULAS MAMARIAS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="others"
            textareaHeight="h-14"
            value={formatForDisplay(formConsultation?.others ?? "")}
            onChange={(e) => setFieldConsultation("others", e.target.value)}
          >
            OTROS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="major_vessels"
            textareaHeight="h-18"
            value={formatForDisplay(formConsultation?.major_vessels ?? "")}
            onChange={(e) =>
              setFieldConsultation("major_vessels", e.target.value)
            }
          >
            GRANDES VASOS, VENAS Y ARTERIAS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="abdominal_cavity"
            textareaHeight="h-18"
            value={formatForDisplay(formConsultation?.abdominal_cavity ?? "")}
            onChange={(e) =>
              setFieldConsultation("abdominal_cavity", e.target.value)
            }
          >
            CAVIDAD ABDOMINAL
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="conclusions"
            textareaHeight="h-18"
            value={formatForDisplay(formConsultation?.conclusions ?? "")}
            onChange={(e) =>
              setFieldConsultation("conclusions", e.target.value)
            }
          >
            CONCLUSIONES
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="observations"
            textareaHeight="h-14"
            value={formatForDisplay(formConsultation?.observations ?? "")}
            onChange={(e) =>
              setFieldConsultation("observations", e.target.value)
            }
          >
            OBSERVACIONES
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="mammary_notes"
            textareaHeight="h-18"
            value={formatForDisplay(formConsultation?.mammary_notes ?? "")}
            onChange={(e) =>
              setFieldConsultation("mammary_notes", e.target.value)
            }
          >
            FRASE LARGA O PLANTILLA
          </ConsultLabeledTextarea>

          {/* ======== Saving and status messages ======== */}
          <div className="h-5 mt-1 flex justify-center items-center">
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
