"use client";

import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Dialog } from "@headlessui/react";
import FullTemplatesContent from "./_components/FullTemplatesContent";

interface Props {
  isFullTemplatesDialogOpen: boolean;
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
}

export default function FullReportTemplatesDialog({
  isFullTemplatesDialogOpen,
  setIsFullTemplatesDialogOpen,
}: Props) {
  return (
    <div>
      <Dialog
        open={isFullTemplatesDialogOpen}
        onClose={() => {}}
        className="fixed inset-0 z-50 flex overflow-x-auto overflow-y-auto"
      >
        {/* Overlay oscuro que bloquea todo lo de atrás */}
        <div className="fixed inset-0 bg-black/20 " aria-hidden="true" />

        {/* Panel del modal */}

        <Dialog.Panel className="w-[1200px] h-[760px] flex flex-col flex-shrink-0 bg-amber-50 rounded-md z-50 border border-gray-500 shadow-lg relative m-auto">
          {/* Navbar */}
          <div className="w-full flex-shrink-0">
            <Navbar>Plantillas</Navbar>
          </div>

          {/* ========= CONTENT ========= */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <FullTemplatesContent
              setIsFullTemplatesDialogOpen={setIsFullTemplatesDialogOpen}
            />
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
