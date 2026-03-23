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

  return (
    <>
      {/* =========== Main content =========== */}
      <div className="ml-6 flex flex-row gap-4">
        {/* =========== Consultation form ============ */}
        <div className="w-[650px] -mt-2 flex flex-col gap-1">
          <ConsultLabeledTextarea
            value={formConsultation?.liver ?? ""}
            onChange={(e) => setFieldConsultation("liver", e.target.value)}
          >
            HÍGADO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.gallbladder ?? ""}
            onChange={(e) =>
              setFieldConsultation("gallbladder", e.target.value)
            }
          >
            VESÍCULA BILIAR
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.left_kidney ?? ""}
            onChange={(e) =>
              setFieldConsultation("left_kidney", e.target.value)
            }
          >
            RIÑÓN IZQUIERDO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.right_kidney ?? ""}
            onChange={(e) =>
              setFieldConsultation("right_kidney", e.target.value)
            }
          >
            RIÑÓN DERECHO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.liver_notes ?? ""}
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
          <EditableSelectList />
        </div>
      </div>
    </>
  );
}
