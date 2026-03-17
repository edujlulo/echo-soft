import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";

export default function MammaryGlandsAndOthers() {
  return (
    <>
      {/* =========== Main content =========== */}
      <div className="flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[550px] -mt-2 flex flex-col gap-1">
          <ConsultLabeledTextarea>GLÁNDULAS MAMARIAS</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>OTROS</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>
            GRANDES VASOS, VENAS Y ARTERIAS
          </ConsultLabeledTextarea>
          <ConsultLabeledTextarea>CAVIDAD ABDOMINAL</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>CONCLUSIONES</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>OBSERVACIONES</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>
            FRASE LARGA O PLANTILLA
          </ConsultLabeledTextarea>
        </div>

        {/* =========== Editable select list section ============ */}
        <div className="w-[550px]">
          <EditableSelectList />
        </div>
      </div>
    </>
  );
}
