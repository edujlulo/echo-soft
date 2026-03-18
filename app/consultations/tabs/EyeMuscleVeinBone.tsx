import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import React from "react";

export default function EyeMuscleVeinBone() {
  return (
    <>
      {/* =========== Main content =========== */}
      <div className="ml-6 flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[650px] -mt-2 flex flex-col gap-1">
          <ConsultLabeledTextarea>ESTUDIO OCULAR</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>ESTUDIO MUSCULAR</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>TORAX - PULMONES</ConsultLabeledTextarea>
          <ConsultLabeledTextarea>HUESOS Y OTROS</ConsultLabeledTextarea>
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
