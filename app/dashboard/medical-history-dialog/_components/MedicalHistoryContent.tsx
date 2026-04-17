"use client";

import MedicalHistoryActions from "./MedicalHistoryActions";
import MedicalHistoryImagesRow from "./MedicalHistoryImagesRow";
import MedicalHistoryPetInfoForm from "./MedicalHistoryPetInfoForm";
import MedicalHistoryTable from "./MedicalHistoryTable";
import MedicalHistoryTextarea from "./MedicalHistoryTextarea";

interface Props {
  setIsMedicalHistoryDialogOpen: (open: boolean) => void;
}

export default function MedicalHistoryContent({
  setIsMedicalHistoryDialogOpen,
}: Props) {
  return (
    <div className="mx-2 flex h-full min-h-0 flex-col gap-1 p-2">
      {/* ===== PET INFO FORM ==== */}
      <div className="flex-shrink-0">
        <MedicalHistoryPetInfoForm />
      </div>

      <div className="flex min-h-0 flex-1 flex-row gap-2">
        {/* ===== TEXTAREA ==== */}
        <div className="flex min-w-0 flex-1 min-h-0">
          <MedicalHistoryTextarea />
        </div>

        <div className="flex min-w-0 min-h-0 flex-1 flex-col gap-1">
          {/* ===== TABLE ==== */}
          <div className="min-w-0 min-h-0 flex-1 overflow-hidden">
            <MedicalHistoryTable />
          </div>

          {/* ===== ACTIONS BUTTONS ==== */}
          <div className="min-w-0 flex-shrink-0">
            <MedicalHistoryActions
              setIsMedicalHistoryDialogOpen={setIsMedicalHistoryDialogOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
