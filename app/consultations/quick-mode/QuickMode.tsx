"use client";

import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Dialog } from "@headlessui/react";
import QuickModeContent from "./_components/QuickModeContent";

interface Props {
  isQuickModeOpen: boolean;
  setIsQuickModeOpen: (open: boolean) => void;
}

export default function QuickMode({
  isQuickModeOpen,
  setIsQuickModeOpen,
}: Props) {
  return (
    <>
      <Dialog
        open={isQuickModeOpen}
        onClose={() => {}}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
      >
        {/* Overlay oscuro que bloquea todo lo de atrás */}
        <div className="fixed inset-0 bg-black/20 " aria-hidden="true" />

        {/* Panel del modal */}

        <Dialog.Panel className="w-[1500px] h-[700px] flex-shrink-0 overflow-hidden mt-15 bg-amber-50 rounded-md z-50 border border-gray-500 shadow-lg relative">
          {/* Botón cerrar */}
          <button
            onClick={() => setIsQuickModeOpen(false)}
            className="pt-0.5 absolute top-2 right-2 w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md border border-gray-500 transition-colors text-2xl"
          >
            ×
          </button>

          {/* Navbar */}
          <div className="w-full">
            <Navbar>Consulta de Ecografía</Navbar>
          </div>

          {/* Content */}
          <QuickModeContent />

          {/* Close button */}
          <div className=" flex justify-center gap-3">
            <Button onClick={() => setIsQuickModeOpen(false)} className="w-23">
              Cerrar
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
