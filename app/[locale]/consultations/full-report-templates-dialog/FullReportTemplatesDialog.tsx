"use client";

import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Dialog } from "@headlessui/react";
import FullTemplatesContent from "./_components/FullTemplatesContent";
import DialogScaleWrapper from "@/components/DialogScaleWrapper";
import { useTranslations } from "next-intl";

interface Props {
  isFullTemplatesDialogOpen: boolean;
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
}

export default function FullReportTemplatesDialog({
  isFullTemplatesDialogOpen,
  setIsFullTemplatesDialogOpen,
}: Props) {
  const t = useTranslations("FullReportTemplatesDialog");

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

        <DialogScaleWrapper
          baseWidth={1200}
          baseHeight={760}
          minScale={0.8}
          className="m-auto"
        >
          <Dialog.Panel className="w-[1200px] h-[760px] flex flex-col flex-shrink-0 bg-amber-50 rounded-md z-50 border border-gray-500 shadow-lg relative m-auto">
            {/* Navbar */}
            <div className="w-full flex-shrink-0">
              <Navbar>{t("templates")}</Navbar>
            </div>

            {/* ========= CONTENT ========= */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <FullTemplatesContent
                setIsFullTemplatesDialogOpen={setIsFullTemplatesDialogOpen}
              />
            </div>
          </Dialog.Panel>
        </DialogScaleWrapper>
      </Dialog>
    </div>
  );
}
