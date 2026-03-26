import React, { useState } from "react";
import Button from "./Button";
import { Dialog } from "@headlessui/react";
import Navbar from "./Navbar";
import { Database } from "@/types/database";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void; // función para abrir/cerrar modal
  selectedTemplate: TextTemplateRow | null;
  setSelectedTemplate: (template: TextTemplateRow | null) => void;
  addTemplate: () => Promise<TextTemplateRow | null>;
  updateTemplate: () => Promise<TextTemplateRow | null>;
}

export default function EditableSelectListModal({
  isModalOpen,
  setIsModalOpen,
  selectedTemplate,
  setSelectedTemplate,
  addTemplate,
  updateTemplate,
}: Props) {
  return (
    <>
      <Dialog
        open={isModalOpen}
        onClose={() => {}}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Overlay oscuro que bloquea todo lo de atrás */}
        <div className="fixed inset-0 bg-black/20 " aria-hidden="true" />

        {/* Panel del modal */}
        <Dialog.Panel className="bg-gray-400 rounded-md w-200 z-50 border border-gray-500 shadow-lg relative">
          {/* Botón cerrar */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="pt-0.5 absolute top-2 right-2 w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md border border-gray-500 transition-colors text-2xl"
          >
            ×
          </button>

          {/* Navbar */}
          <div className="w-full">
            <Navbar>Nuevo Registro...</Navbar>
          </div>
          <div className="py-4 px-4 flex flex-row gap-2">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Texto:
            </Dialog.Title>

            <textarea
              className="w-full border rounded p-2 bg-white"
              rows={5}
              value={selectedTemplate?.content ?? ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (!selectedTemplate) return;
                setSelectedTemplate({
                  ...selectedTemplate,
                  content: e.target.value === "" ? null : e.target.value,
                });
              }}
              placeholder="Escribe algo..."
            />
          </div>
          <div className="pb-6 flex justify-center gap-3">
            <Button
              onClick={async () => {
                if (!selectedTemplate) return;

                let result = null;

                if (selectedTemplate?.id) {
                  result = await updateTemplate();
                } else {
                  result = await addTemplate();
                }

                if (result) {
                  setIsModalOpen(false);
                }
              }}
              className="w-23"
            >
              Aceptar
            </Button>

            <Button onClick={() => setIsModalOpen(false)} className="w-23">
              Cancelar
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
