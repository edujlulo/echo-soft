import PetImage from "@/app/dashboard/_components/PetImage";
import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import ConsultationPetForm from "./ConsultationPetForm";
import { Database } from "@/types/database";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";

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
  // const formConsultation = useConsultationStore((s) => s.formConsultation);
  // const setFieldConsultation = useConsultationStore(
  //   (s) => s.setFieldConsultation,
  // );

  const {
    formConsultation,
    setFieldConsultation,
    isSavingConsultation,
    statusMessageConsultation,
  } = useConsultationForm();

  const { setActiveField } = useEditableSelectListStore();

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
              onFocus={() => setActiveField("MOTIVO DEL EXAMEN ECOGRÁFICO")}
              onBlur={() => setActiveField(null)}
            >
              MOTIVO DEL EXAMEN ECOGRÁFICO
            </ConsultLabeledTextarea>
            <ConsultLabeledTextarea
              value={formConsultation?.equipment_used ?? ""}
              onChange={(e) =>
                setFieldConsultation("equipment_used", e.target.value)
              }
              onFocus={() => setActiveField("EQUIPO UTILIZADO")}
              onBlur={() => setActiveField(null)}
            >
              EQUIPO UTILIZADO
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
        </div>

        {/* =========== Editable select list section ============ */}
        <div className="w-[620px]">
          <EditableSelectList />
        </div>
      </div>
    </>
  );
}
