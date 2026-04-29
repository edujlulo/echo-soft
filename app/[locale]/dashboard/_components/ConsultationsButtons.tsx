"use client";

import Button from "@/components/Button";
import { useSelectedPetStore, emptyPet } from "@/context/selectedPetStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { useParams, useRouter } from "next/navigation";
import MedicalHistoryDialog from "../medical-history-dialog/MedicalHistoryDialog";
import { useMemo, useState } from "react";
import AppDialog from "@/components/AppDialog";
import { useActiveVetStore } from "@/context/activeVetStore";
import { Database } from "@/types/database";
import { useTranslations } from "next-intl";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface Props {
  addConsultation: (petId: string) => Promise<ConsultationRow | null>;
  deleteConsultation: (consultation: ConsultationRow) => Promise<void>;
  isDeletingConsultation: boolean;
}

export default function ConsultationsButtons({
  addConsultation,
  deleteConsultation,
  isDeletingConsultation,
}: Props) {
  const t = useTranslations("ConsultationsButtons");
  const [isMedicalHistoryDialogOpen, setIsMedicalHistoryDialogOpen] =
    useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [isCreatingConsultation, setIsCreatingConsultation] = useState(false);

  const disableActions = isCreatingConsultation || isDeletingConsultation;

  const router = useRouter();

  const params = useParams();
  const locale = params.locale as string;

  const selectedPet = useSelectedPetStore((s) => s.selectedPet);
  const { selectedConsultation } = useConsultationForm();
  const activeVet = useActiveVetStore((s) => s.activeVet);

  function navigateToHome() {
    router.push(`/${locale}/home`);
  }

  const navigateToConsultations = () => {
    router.push(`/${locale}/consultations`);
  };

  const formattedConsultationDate = useMemo(() => {
    if (!selectedConsultation?.consultation_date) return t("dateUnavailable");

    const date = new Date(selectedConsultation.consultation_date);

    if (isNaN(date.getTime())) return t("dateUnavailable");

    return date.toLocaleDateString("es-ES");
  }, [selectedConsultation, t]);

  const handleOpenDeleteConfirmation = () => {
    if (!selectedConsultation?.consultation_id) {
      setDialogMessage(t("selectConsultation"));
      setIsAlertDialogOpen(true);
      return;
    }

    if (!activeVet?.vet_id) {
      setDialogMessage(t("noActiveVet"));
      setIsAlertDialogOpen(true);
      return;
    }

    setIsDeleteConfirmDialogOpen(true);
  };

  const handleConfirmDeleteConsultation = async () => {
    if (!selectedConsultation?.consultation_id) {
      setIsDeleteConfirmDialogOpen(false);
      setDialogMessage(t("selectConsultation"));
      setIsAlertDialogOpen(true);
      return;
    }

    try {
      await deleteConsultation(selectedConsultation);

      setIsDeleteConfirmDialogOpen(false);
      setDialogMessage(t("consultationDeleted"));
      setIsAlertDialogOpen(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("deleteConsultationError");

      setIsDeleteConfirmDialogOpen(false);
      setDialogMessage(message);
      setIsAlertDialogOpen(true);
    }
  };

  const handleCreateConsultation = async () => {
    if (
      !selectedPet ||
      JSON.stringify(selectedPet) === JSON.stringify(emptyPet)
    ) {
      setDialogMessage(t("selectPet"));
      setIsAlertDialogOpen(true);
      return;
    }

    setIsCreatingConsultation(true);

    try {
      await addConsultation(selectedPet.pet_id!);
      navigateToConsultations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("createConsultationError");

      setDialogMessage(message);
      setIsAlertDialogOpen(true);
    } finally {
      setIsCreatingConsultation(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-2 justify-center items-center">
      <Button
        className="w-38"
        disabled={disableActions}
        onClick={() => {
          if (!selectedConsultation?.consultation_id) {
            setDialogMessage(t("selectConsultation"));
            setIsAlertDialogOpen(true);
            return;
          }

          navigateToConsultations();
        }}
      >
        {t("viewConsultation")}
      </Button>
      <Button
        className={`
    w-38
    ${
      isCreatingConsultation
        ? "cursor-not-allowed opacity-80 bg-blue-500 border-blue-700 text-gray-950 hover:bg-blue-500 hover:border-blue-700"
        : ""
    }
  `}
        onClick={handleCreateConsultation}
        disabled={isCreatingConsultation}
      >
        <span className="flex items-center justify-center gap-2">
          {isCreatingConsultation && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          )}
          <span>
            {isCreatingConsultation ? t("creating") : t("createConsultation")}
          </span>
        </span>
      </Button>
      <div className="flex flex-col items-center">
        <Button
          onClick={handleOpenDeleteConfirmation}
          disabled={disableActions}
          className={`
      w-38
      ${
        isDeletingConsultation
          ? "bg-red-200 border-red-300 text-gray-500 cursor-not-allowed hover:bg-red-200 hover:border-red-300 opacity-80"
          : "bg-red-100 border-red-400 hover:bg-red-300 hover:border-red-500"
      }
    `}
        >
          {isDeletingConsultation ? t("deleting") : t("deleteConsultation")}
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button
          disabled={disableActions}
          onClick={() => {
            if (
              !selectedPet ||
              JSON.stringify(selectedPet) === JSON.stringify(emptyPet)
            ) {
              setDialogMessage(t("selectPet"));
              setIsAlertDialogOpen(true);
              return;
            }

            setIsMedicalHistoryDialogOpen(true);
          }}
          className="w-38"
        >
          {t("medicalHistory")}
        </Button>

        {/* <span className="text-xs text-gray-500 mt-0.5 ml-1">En desarrollo</span> */}
      </div>
      <Button
        onClick={navigateToHome}
        className="mt-5 flex w-20 items-center justify-center px-3 py-1 font-bold bg-green-300 border border-gray-50 hover:bg-green-400"
      >
        {t("close")}
      </Button>
      {/* ============ MEDICAL HISTORY SECTION DIALOG ========== */}
      <MedicalHistoryDialog
        isMedicalHistoryDialogOpen={isMedicalHistoryDialogOpen}
        setIsMedicalHistoryDialogOpen={setIsMedicalHistoryDialogOpen}
      />

      {/* ========== ALERTS DIALOG ============ */}
      <AppDialog
        isOpen={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
        navbarTitle={t("notice")}
        description={dialogMessage}
        showCloseButton
        showFooter
        showCancelButton={false}
        confirmLabel={t("accept")}
        onConfirm={() => setIsAlertDialogOpen(false)}
        widthClassName="w-[420px]"
      />

      <AppDialog
        isOpen={isDeleteConfirmDialogOpen}
        onClose={() => setIsDeleteConfirmDialogOpen(false)}
        navbarTitle={t("confirmDeleteTitle")}
        title={t("confirmDeleteQuestion")}
        description={
          <div className="space-y-3 text-sm">
            <p>
              {t("deleteIntro")}{" "}
              <span className="font-semibold">{formattedConsultationDate}</span>
              .
            </p>

            <p>
              {t("consultationVet")}{" "}
              <span className="font-semibold">
                {selectedConsultation?.vet_name ?? t("notAvailable")}
              </span>
            </p>

            <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-red-800">
              {t("irreversibleWarning")}
            </div>
          </div>
        }
        showCloseButton
        showFooter
        showCancelButton
        cancelLabel={t("cancel")}
        confirmLabel={t("confirmDelete")}
        confirmLoadingLabel={t("deletingConsultation")}
        onConfirm={handleConfirmDeleteConsultation}
        onCancel={() => setIsDeleteConfirmDialogOpen(false)}
        isLoading={isDeletingConsultation}
        disableClose={isDeletingConsultation}
        variant="danger"
        widthClassName="w-[480px]"
      />
    </div>
  );
}
