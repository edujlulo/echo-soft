"use client";

import PatientsTable from "./_components/PatientsTable";
import ConsultationsTable from "./_components/ConsultationsTable";
import DashboardHeader from "./_components/DashboardHeader";
import Navbar from "@/components/Navbar";
import DashboardBottom from "./_components/DashboardBottom";
import { useState } from "react";
import PetFormModal from "./_components/pet-form-modal/PetFormModalPage";
import { useSelectedPetStore } from "@/context/selectedPetStore";
// import { useSelectedPetStore } from "@/context/selectedPetStore";

export default function DashboardPage() {
  const { isCreating, isEditing, resetSelectedPet } = useSelectedPetStore();

  // Abrir modal si está creando o editando
  const open = isCreating || isEditing;

  // Función para cerrar modal: resetea el estado del store
  const handleClose = () => {
    resetSelectedPet();
  };

  return (
    <>
      <div className="w-[1400px] h-[700px] bg-blue-200 flex flex-col rounded-md text-sm">
        {/* NavBar */}
        <div className="w-full">
          <Navbar>Pacientes</Navbar>
        </div>

        {/* =============== Top section ================= */}
        <div className="flex flex-col gap-2 mx-2">
          <DashboardHeader />
          <PatientsTable />
        </div>

        {/* =============== Bottom section ================= */}
        <DashboardBottom />
      </div>
      <PetFormModal isOpen={open} onClose={handleClose} />
    </>
  );
}
