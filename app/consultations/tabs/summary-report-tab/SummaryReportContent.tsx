import React, { useState } from "react";
import ReportDraft from "./ReportDraft";
import PetInfoForm from "./PetInfoForm";
import ReportActions from "./ReportActions";
import { Database } from "@/types/database";
import QuickMode from "../../quick-mode/QuickMode";

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

export default function SummaryReportContent({
  selectedPet,
  setField,
  isSaving,
  statusMessage,
  calculateAge,
}: PetDetailsAndReasonProps) {
  // ========= QUICK MODE MODAL OPEN STATE ===========
  const [isQuickModeOpen, setIsQuickModeOpen] = useState(false);

  return (
    <>
      {/* ====== Main content ======= */}
      <div className="flex flex-col gap-2">
        {/* ======== Top section ======== */}
        <div className="flex flex-row gap-1">
          {/* ======= Report draft ====== */}
          <div>
            <ReportDraft />
          </div>

          {/* ====== Pet info form ====== */}

          <div>
            <PetInfoForm
              selectedPet={selectedPet}
              setField={setField}
              isSaving={isSaving}
              statusMessage={statusMessage}
              calculateAge={calculateAge}
            />
          </div>
        </div>

        {/* ======= Actions buttons ======= */}

        <div>
          <ReportActions setIsQuickModeOpen={setIsQuickModeOpen} />
        </div>
      </div>

      {/* ============ QUICK MODE MODAL ============= */}
      <QuickMode
        isQuickModeOpen={isQuickModeOpen}
        setIsQuickModeOpen={setIsQuickModeOpen}
      />
    </>
  );
}
