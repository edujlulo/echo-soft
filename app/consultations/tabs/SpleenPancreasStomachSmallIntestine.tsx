import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";

export default function SpleenPancreasStomachSmallIntestine() {
  return (
    <>
      {/* =========== Main content =========== */}
      <div className="ml-6 flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[650px] -mt-2 flex flex-col gap-1">
          <ConsultLabeledTextarea>BAZO</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>PÁNCREAS</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>ESTÓMAGO</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>INTESTINO DELGADO</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>
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
