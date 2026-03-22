import PetImage from "@/app/dashboard/_components/PetImage";
import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import ConsultationPetForm from "./ConsultationPetForm";
import { Database } from "@/types/database";
import { useConsultationStore } from "@/context/consultationStore";

type PetUpdate = Database["public"]["Tables"]["pets"]["Update"];
type NewPet = Omit<
  Database["public"]["Tables"]["pets"]["Row"],
  "pet_id" | "record_number"
> &
  Partial<
    Pick<
      Database["public"]["Tables"]["pets"]["Row"],
      "pet_id" | "record_number"
    >
  >;
type SelectedPet = Database["public"]["Tables"]["pets"]["Row"] | NewPet;

type SetFieldFn = (field: keyof PetUpdate, value: string | null) => void;

type CalculateAgeFn = (birthDateStr: string | undefined) => string;

interface PetDetailsAndReasonProps {
  selectedPet: SelectedPet | null;
  setField: SetFieldFn;
  isSaving: boolean;
  statusMessage: string | null;
  calculateAge: CalculateAgeFn;
}

export default function PetDetailsAndReason({
  selectedPet,
  setField,
  isSaving,
  statusMessage,
  calculateAge,
}: PetDetailsAndReasonProps) {
  const formConsultation = useConsultationStore((s) => s.formConsultation);
  const setFieldConsultation = useConsultationStore(
    (s) => s.setFieldConsultation
  );

  return (
    <>
      {/* =========== Main content =========== */}
      <div className="ml-6 flex flex-row gap-4">
        {/* ======== Pet and consultation details section ========== */}
        <div className="flex flex-col gap-2">
          {/* ========== Pet form and image ========== */}
          <div className="flex flex-row gap-2">
            {/* ========= Pet form ========== */}
            <ConsultationPetForm
              selectedPet={selectedPet}
              setField={setField}
              isSaving={isSaving}
              statusMessage={statusMessage}
              calculateAge={calculateAge}
            />
            {/* =========== Pet image ========== */}
            <div className="ml-2">
              <PetImage />
            </div>
          </div>

          {/* =========== Consultation form ============ */}
          <div className="mt-6 flex flex-col gap-4">
            <ConsultLabeledTextarea
              value={formConsultation?.reason_for_ultrasound ?? ""}
              onChange={(e) =>
                setFieldConsultation("reason_for_ultrasound", e.target.value)
              }
            >
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
