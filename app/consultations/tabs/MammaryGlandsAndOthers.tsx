import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";

export default function MammaryGlandsAndOthers() {
  return (
    <>
      {/* =========== Main content =========== */}
      <div className="ml-6 flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[650px] -mt-2 flex flex-col gap-0.5">
          <ConsultLabeledTextarea textareaHeight="h-18">
            GLÁNDULAS MAMARIAS
          </ConsultLabeledTextarea>
          <ConsultLabeledTextarea textareaHeight="h-14">
            OTROS
          </ConsultLabeledTextarea>
          <ConsultLabeledTextarea textareaHeight="h-18">
            GRANDES VASOS, VENAS Y ARTERIAS
          </ConsultLabeledTextarea>
          <ConsultLabeledTextarea textareaHeight="h-18">
            CAVIDAD ABDOMINAL
          </ConsultLabeledTextarea>
          <ConsultLabeledTextarea textareaHeight="h-18">
            CONCLUSIONES
          </ConsultLabeledTextarea>
          <ConsultLabeledTextarea textareaHeight="h-14">
            OBSERVACIONES
          </ConsultLabeledTextarea>
          <ConsultLabeledTextarea textareaHeight="h-18">
            FRASE LARGA O PLANTILLA
          </ConsultLabeledTextarea>
        </div>

        {/* =========== Editable select list section ============ */}
        <div className="w-[650px]">
          <EditableSelectList />
        </div>
      </div>
    </>
  );
}
