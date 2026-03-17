import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";

export default function LargeIntestineBladderUrethraLymph() {
  return (
    <>
      {/* =========== Main content =========== */}
      <div className="flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[550px] -mt-2 flex flex-col gap-1">
          <ConsultLabeledTextarea>COLON</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>VEJIGA URINARIA</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>URETRA</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>LINFONODOS</ConsultLabeledTextarea>
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
