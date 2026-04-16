"use client";

import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Dialog } from "@headlessui/react";
import MedicalHistoryContent from "./_components/MedicalHistoryContent";

interface Props {
  isMedicalHistoryDialogOpen: boolean;
  setIsMedicalHistoryDialogOpen: (open: boolean) => void;
}

export default function MedicalHistoryDialog({
  isMedicalHistoryDialogOpen,
  setIsMedicalHistoryDialogOpen,
}: Props) {
  return (
    <div>
      <Dialog
        open={isMedicalHistoryDialogOpen}
        onClose={() => {}}
        className="fixed inset-0 z-50 flex overflow-x-auto overflow-y-auto"
      >
        {/* Overlay oscuro que bloquea todo lo de atrás */}
        <div className="fixed inset-0 bg-black/20 " aria-hidden="true" />

        {/* Panel del modal */}

        <Dialog.Panel className="w-[1100px] h-[650px] flex flex-col flex-shrink-0 bg-amber-50 rounded-md z-50 border border-gray-500 shadow-lg relative m-auto">
          {/* Botón cerrar */}
          <button
            onClick={() => setIsMedicalHistoryDialogOpen(false)}
            className="pt-0.5 absolute top-2 right-2 w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md border border-gray-500 transition-colors text-2xl"
          >
            ×
          </button>

          {/* Navbar */}
          <div className="w-full flex-shrink-0">
            <Navbar>Visor de informes</Navbar>
          </div>

          {/* ========= CONTENT ========= */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <MedicalHistoryContent
              setIsMedicalHistoryDialogOpen={setIsMedicalHistoryDialogOpen}
            />
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
