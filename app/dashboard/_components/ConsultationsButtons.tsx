"use client";

import Button from "@/components/Button";
import { useSelectedPetStore, emptyPet } from "@/context/selectedPetStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { useConsultations } from "@/hooks/useConsultations";
import { useRouter } from "next/navigation";
import MedicalHistoryDialog from "../medical-history-dialog/MedicalHistoryDialog";
import { useState } from "react";
import AppDialog from "@/components/AppDialog";

export default function ConsultationsButtons() {
  const [isMedicalHistoryDialogOpen, setIsMedicalHistoryDialogOpen] =
    useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const router = useRouter();

  const { selectedPet } = useSelectedPetStore();
  const { selectedConsultation } = useConsultationForm();

  const { addConsultation } = useConsultations();

  function navigateToHome() {
    router.push("/home");
  }

  const navigateToConsultations = () => {
    router.push("/consultations");
  };

  return (
    <div className="mb-8 flex flex-col gap-2 justify-center items-center">
      <Button
        className="w-33"
        onClick={() => {
          if (!selectedConsultation?.consultation_id) {
            setDialogMessage("Por favor seleccione una consulta");
            setIsAlertDialogOpen(true);
            return;
          }

          navigateToConsultations();
        }}
      >
        Ver Consulta
      </Button>
      <Button
        className="w-33"
        onClick={() => {
          if (
            !selectedPet ||
            JSON.stringify(selectedPet) === JSON.stringify(emptyPet)
          ) {
            setDialogMessage("Por favor seleccione una mascota");
            setIsAlertDialogOpen(true);
            return;
          }

          addConsultation(selectedPet?.pet_id ?? "");
          navigateToConsultations();
        }}
      >
        Crear Consulta
      </Button>
      <div className="flex flex-col items-center">
        <Button
          disabled
          className="
      bg-gray-200 
      border-gray-300 
      text-gray-500 
      cursor-not-allowed 
      hover:bg-gray-200 
      hover:border-gray-300
      opacity-80
      w-33
    "
        >
          Borrar Consulta
        </Button>

        {/* <span className="text-xs text-gray-500 mt-0.5 ml-1">En desarrollo</span> */}
      </div>
      <div className="flex flex-col items-center">
        <Button
          onClick={() => {
            if (
              !selectedPet ||
              JSON.stringify(selectedPet) === JSON.stringify(emptyPet)
            ) {
              setDialogMessage("Por favor seleccione una mascota");
              setIsAlertDialogOpen(true);
              return;
            }

            setIsMedicalHistoryDialogOpen(true);
          }}
        >
          Historial Médico
        </Button>

        {/* <span className="text-xs text-gray-500 mt-0.5 ml-1">En desarrollo</span> */}
      </div>
      <Button
        onClick={navigateToHome}
        className="mt-5 flex w-20 items-center justify-center px-3 py-1 font-bold bg-green-300 border border-gray-50 hover:bg-green-400"
      >
        Cerrar
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
        navbarTitle="Aviso"
        description={dialogMessage}
        showCloseButton
        showFooter
        showCancelButton={false}
        confirmLabel="Aceptar"
        onConfirm={() => setIsAlertDialogOpen(false)}
        widthClassName="w-[420px]"
      />
    </div>
  );
}
