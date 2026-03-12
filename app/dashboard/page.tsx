"use client";

import PatientsTable from "./_components/PatientsTable";
import ConsultationsTable from "./_components/ConsultationsTable";
import DashboardHeader from "./_components/DashboardHeader";
import Navbar from "@/components/Navbar";
import DashboardBottom from "./_components/DashboardBottom";
import { useState } from "react";
import PetFormModal from "./_components/pet-form-modal/PetFormModalPage";

export default function DashboardPage() {
  const [isPetFormModalOpen, setIsPetFormModalOpen] = useState(false);

  function openPetFormModal() {
    setIsPetFormModalOpen(true);
  }

  function closePetFormModal() {
    setIsPetFormModalOpen(false);
  }

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
        <DashboardBottom onNewPetClick={openPetFormModal} />
      </div>
      <PetFormModal isOpen={isPetFormModalOpen} onClose={closePetFormModal} />
    </>
  );
}
