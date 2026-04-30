"use client";

import Button from "@/components/Button";
import { useTranslations } from "next-intl";

interface Props {
  setIsMedicalHistoryDialogOpen: (open: boolean) => void;
}

export default function MedicalHistoryActions({
  setIsMedicalHistoryDialogOpen,
}: Props) {
  const t = useTranslations("MedicalHistory");

  return (
    <div className="my-2 flex justify-center">
      <Button onClick={() => setIsMedicalHistoryDialogOpen(false)}>
        {t("close")}
      </Button>
    </div>
  );
}
