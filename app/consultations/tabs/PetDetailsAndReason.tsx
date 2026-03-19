import PetImage from "@/app/dashboard/_components/PetImage";
import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import LabeledInput from "@/components/LabeledInput";
import ConsultationPetForm from "./ConsultationPetForm";

export default function PetDetailsAndReason() {
  return (
    <>
      {/* =========== Main content =========== */}
      <div className="ml-6 flex flex-row gap-4">
        {/* ======== Pet and consultation details section ========== */}
        <div className="flex flex-col gap-2">
          {/* ========== Pet form and image ========== */}
          <div className="flex flex-row gap-2">
            {/* ========= Pet form ========== */}
            <ConsultationPetForm />
            {/* =========== Pet image ========== */}
            <div className="ml-2">
              <PetImage />
            </div>
          </div>

          {/* =========== Consultation form ============ */}
          <div className="mt-6 flex flex-col gap-4">
            <ConsultLabeledTextarea>
              MOTIVO DEL EXAMEN ECOGRÁFICO
            </ConsultLabeledTextarea>
            <ConsultLabeledTextarea>EQUIPO UTILIZADO</ConsultLabeledTextarea>
          </div>
        </div>

        {/* =========== Editable select list section ============ */}
        <div className="w-[620px]">
          <EditableSelectList />
        </div>
      </div>
    </>
  );
}
