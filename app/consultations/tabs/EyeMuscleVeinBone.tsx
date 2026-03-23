import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import React from "react";

export default function EyeMuscleVeinBone() {
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
            value={formConsultation?.ocular_study ?? ""}
            onChange={(e) =>
              setFieldConsultation("ocular_study", e.target.value)
            }
          >
            ESTUDIO OCULAR
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.muscular_study ?? ""}
            onChange={(e) =>
              setFieldConsultation("muscular_study", e.target.value)
            }
          >
            ESTUDIO MUSCULAR
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.thorax_lungs ?? ""}
            onChange={(e) =>
              setFieldConsultation("thorax_lungs", e.target.value)
            }
          >
            TORAX - PULMONES
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.bones_others ?? ""}
            onChange={(e) =>
              setFieldConsultation("bones_others", e.target.value)
            }
          >
            HUESOS Y OTROS
          </ConsultLabeledTextarea>

          <ConsultLabeledTextarea
            value={formConsultation?.ocular_notes ?? ""}
            onChange={(e) =>
              setFieldConsultation("ocular_notes", e.target.value)
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
