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
    <div className="flex h-full mx-2 min-h-0 flex-col gap-1 p-2">
      {/* ===== PET INFO FORM ==== */}
      <div className="flex-shrink-0">
        <MedicalHistoryPetInfoForm />
      </div>

      <div className="flex flex-1 min-h-0 flex-row gap-2">
        {/* ===== TEXTAREA ==== */}
        <div className="flex min-w-0 flex-1">
          <MedicalHistoryTextarea />
        </div>

        {/* ===== TABLE ==== */}
        <div className="flex min-w-0 flex-1">
          <MedicalHistoryTable />
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className="flex flex-row gap-2">
          {/* ===== IMAGES ROW ==== */}
          <MedicalHistoryImagesRow />

          {/* ===== ACTIONS BUTTONS ==== */}
          <MedicalHistoryActions />
        </div>
      </div>
    </div>
  );
}
