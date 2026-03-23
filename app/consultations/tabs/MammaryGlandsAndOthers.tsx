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

  return (
    <>
      {/* =========== Main content =========== */}
      <div className="ml-6 flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[650px] -mt-4 flex flex-col gap-0.5">
          <ConsultLabeledTextarea
            textareaHeight="h-18"
            value={formConsultation?.mammary_glands ?? ""}
            onChange={(e) =>
              setFieldConsultation("mammary_glands", e.target.value)
            }
          >
            GLÁNDULAS MAMARIAS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            textareaHeight="h-14"
            value={formConsultation?.others ?? ""}
            onChange={(e) => setFieldConsultation("others", e.target.value)}
          >
            OTROS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            textareaHeight="h-18"
            value={formConsultation?.major_vessels ?? ""}
            onChange={(e) =>
              setFieldConsultation("major_vessels", e.target.value)
            }
          >
            GRANDES VASOS, VENAS Y ARTERIAS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            textareaHeight="h-18"
            value={formConsultation?.abdominal_cavity ?? ""}
            onChange={(e) =>
              setFieldConsultation("abdominal_cavity", e.target.value)
            }
          >
            CAVIDAD ABDOMINAL
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            textareaHeight="h-18"
            value={formConsultation?.conclusions ?? ""}
            onChange={(e) =>
              setFieldConsultation("conclusions", e.target.value)
            }
          >
            CONCLUSIONES
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            textareaHeight="h-14"
            value={formConsultation?.observations ?? ""}
            onChange={(e) =>
              setFieldConsultation("observations", e.target.value)
            }
          >
            OBSERVACIONES
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            textareaHeight="h-18"
            value={formConsultation?.mammary_notes ?? ""}
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
          <EditableSelectList />
        </div>
      </div>
    </>
  );
}
