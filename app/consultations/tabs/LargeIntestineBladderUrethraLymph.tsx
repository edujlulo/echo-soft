import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import { useConsultationForm } from "@/hooks/useConsultationForm";

export default function LargeIntestineBladderUrethraLymph() {
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
        <div className="w-[650px] -mt-2 flex flex-col gap-1">
          <ConsultLabeledTextarea
            value={formConsultation?.colon ?? ""}
            onChange={(e) => setFieldConsultation("colon", e.target.value)}
          >
            COLON
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.urinary_bladder ?? ""}
            onChange={(e) =>
              setFieldConsultation("urinary_bladder", e.target.value)
            }
          >
            VEJIGA URINARIA
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.urethra ?? ""}
            onChange={(e) => setFieldConsultation("urethra", e.target.value)}
          >
            URETRA
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.lymph_nodes ?? ""}
            onChange={(e) =>
              setFieldConsultation("lymph_nodes", e.target.value)
            }
          >
            LINFONODOS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.colon_notes ?? ""}
            onChange={(e) =>
              setFieldConsultation("colon_notes", e.target.value)
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
          <EditableSelectList />
        </div>
      </div>
    </>
  );
}
