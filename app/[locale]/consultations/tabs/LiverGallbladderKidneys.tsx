"use client";

import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import { useConsultationStore } from "@/context/consultationStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";

export default function LiverGallbladderKidneys() {
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
      <div className="ml-6 flex flex-row gap-4 overflow-hidden ">
        {/* =========== Consultation form ============ */}
        <div className="w-[650px] flex flex-col gap-1">
          <ConsultLabeledTextarea
            categoryKey="liver"
            value={formatForDisplay(formConsultation?.liver ?? "")}
            onChange={(e) => setFieldConsultation("liver", e.target.value)}
          >
            HÍGADO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="gallbladder"
            value={formatForDisplay(formConsultation?.gallbladder ?? "")}
            onChange={(e) =>
              setFieldConsultation("gallbladder", e.target.value)
            }
          >
            VESÍCULA BILIAR
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="left_kidney"
            value={formatForDisplay(formConsultation?.left_kidney ?? "")}
            onChange={(e) =>
              setFieldConsultation("left_kidney", e.target.value)
            }
          >
            RIÑÓN IZQUIERDO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="right_kidney"
            value={formatForDisplay(formConsultation?.right_kidney ?? "")}
            onChange={(e) =>
              setFieldConsultation("right_kidney", e.target.value)
            }
          >
            RIÑÓN DERECHO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            categoryKey="liver_notes"
            value={formatForDisplay(formConsultation?.liver_notes ?? "")}
            onChange={(e) =>
              setFieldConsultation("liver_notes", e.target.value)
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
