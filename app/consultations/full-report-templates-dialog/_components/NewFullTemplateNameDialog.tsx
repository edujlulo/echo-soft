"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Database } from "@/types/database";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

interface Props {
  isNewTemplateNameDialogOpen: boolean;
  setIsNewTemplateNameDialogOpen: (open: boolean) => void;
}

export default function NewFullTemplateNameDialog({
  isNewTemplateNameDialogOpen,
  setIsNewTemplateNameDialogOpen,
}: Props) {
  // Ref for focus into input:
  const textareaRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <Dialog
        open={isNewTemplateNameDialogOpen}
        onClose={() => {}}
        initialFocus={textareaRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Overlay oscuro que bloquea todo lo de atrás */}
        <div className="fixed inset-0 bg-black/20 " aria-hidden="true" />

        {/* Panel del modal */}
        <Dialog.Panel className="bg-gray-300 rounded-md w-200 z-50 border border-gray-500 shadow-lg relative">
          {/* Botón cerrar */}
          <button
            onClick={() => setIsNewTemplateNameDialogOpen(false)}
            className="pt-0.5 absolute top-2 right-2 w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md border border-gray-500 transition-colors text-2xl"
          >
            ×
          </button>

          {/* Navbar */}
          <div className="w-full">
            <Navbar>Crear plantillas</Navbar>
          </div>
          <div className="py-4 px-20 flex flex-col gap-2 justify-center items-center">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Nombre de la nueva plantilla
            </Dialog.Title>

            <input
              className="w-full border rounded p-2 bg-white"
              ref={textareaRef}
              autoFocus
              placeholder="Escribe algo..."
              onFocus={(e) => {
                // poner cursor al final cuando reciba foco
                const val = e.target.value;
                e.target.setSelectionRange(val.length, val.length);
              }}
            />
          </div>
          <div className="pb-6 flex justify-center gap-8">
            <Button className="w-30">Crear plantilla</Button>

            <Button
              onClick={() => setIsNewTemplateNameDialogOpen(false)}
              className="w-23"
            >
              Cancelar
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
