"use client";

import Button from "@/components/Button";

interface Props {
  setIsMedicalHistoryDialogOpen: (open: boolean) => void;
}

export default function MedicalHistoryActions({
  setIsMedicalHistoryDialogOpen,
}: Props) {
  return (
    <div className="my-2 flex justify-center">
      <Button onClick={() => setIsMedicalHistoryDialogOpen(false)}>
        Cerrar
      </Button>
    </div>
  );
}
