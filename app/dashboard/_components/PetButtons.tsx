"use client";

import AppDialog from "@/components/AppDialog";
import Button from "@/components/Button";
import { emptyPet, useSelectedPetStore } from "@/context/selectedPetStore";
import { useState } from "react";

export default function PetButtons() {
  const { selectedPet, startCreating, startEditing } = useSelectedPetStore();

  const [dialogMessage, setDialogMessage] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  return (
    <div className="mb-2 flex flex-col gap-7">
      <Button className="w-38" onClick={() => startCreating()}>
        Nueva Mascota
      </Button>
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

          startEditing();
        }}
      >
        Modificar Mascota
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
      w-38
    "
        >
          Borrar Mascota
        </Button>
      </div>

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
