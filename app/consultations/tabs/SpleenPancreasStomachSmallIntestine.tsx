"use client";

import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import { useConsultationForm } from "@/hooks/useConsultationForm";

export default function SpleenPancreasStomachSmallIntestine() {
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
            value={formConsultation?.spleen ?? ""}
            onChange={(e) => setFieldConsultation("spleen", e.target.value)}
          >
            BAZO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.pancreas ?? ""}
            onChange={(e) => setFieldConsultation("pancreas", e.target.value)}
          >
            PÁNCREAS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.stomach ?? ""}
            onChange={(e) => setFieldConsultation("stomach", e.target.value)}
          >
            ESTÓMAGO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.small_intestine ?? ""}
            onChange={(e) =>
              setFieldConsultation("small_intestine", e.target.value)
            }
          >
            INTESTINO DELGADO
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.spleen_notes ?? ""}
            onChange={(e) =>
              setFieldConsultation("spleen_notes", e.target.value)
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
