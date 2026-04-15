"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Database } from "@/types/database";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

interface Props {
  isNewTemplateNameDialogOpen: boolean;
  setIsNewTemplateNameDialogOpen: (open: boolean) => void;
  mode: "create" | "rename";
  initialValue: string;
  onCreateTemplate: (label: string) => Promise<TextTemplateRow | null>;
  onRenameTemplate: (label: string) => Promise<TextTemplateRow | null>;
  isSubmitting: boolean;
}

export default function NewFullTemplateNameDialog({
  isNewTemplateNameDialogOpen,
  setIsNewTemplateNameDialogOpen,
  mode,
  initialValue,
  onCreateTemplate,
  onRenameTemplate,
  isSubmitting,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNewTemplateNameDialogOpen) return;

    if (mode === "rename") {
      setTemplateName(initialValue ?? "");
      setError(null);
      return;
    }

    setTemplateName("");
    setError(null);
  }, [isNewTemplateNameDialogOpen, mode, initialValue]);

  function handleClose() {
    setTemplateName("");
    setError(null);
    setIsNewTemplateNameDialogOpen(false);
  }

  async function handleSubmit() {
    const trimmedName = templateName.trim();

    if (!trimmedName) {
      setError("Debe escribir un nombre para la plantilla.");
      return;
    }

    const result =
      mode === "rename"
        ? await onRenameTemplate(trimmedName)
        : await onCreateTemplate(trimmedName);

    if (!result) {
      return;
    }

    handleClose();
  }

  return (
    <Dialog
      open={isNewTemplateNameDialogOpen}
      onClose={() => {}}
      initialFocus={inputRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <Dialog.Panel className="bg-gray-300 rounded-md w-200 z-50 border border-gray-500 shadow-lg relative">
        <button
          onClick={handleClose}
          className="pt-0.5 absolute top-2 right-2 w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md border border-gray-500 transition-colors text-2xl"
        >
          ×
        </button>

        <div className="w-full">
          <Navbar>Crear plantillas</Navbar>
        </div>

        <div className="py-4 px-20 flex flex-col gap-2 justify-center items-center">
          <Dialog.Title className="text-lg font-semibold mb-2">
            {mode === "rename"
              ? "Modificar nombre de la plantilla"
              : "Nombre de la nueva plantilla"}
          </Dialog.Title>

          <input
            ref={inputRef}
            value={templateName}
            onChange={(e) => {
              setTemplateName(e.target.value.toUpperCase());
              if (error) {
                setError(null);
              }
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await handleSubmit();
              }
            }}
            className="w-full border rounded p-2 bg-white"
            autoFocus
            placeholder="Escribe algo..."
            onFocus={(e) => {
              const value = e.target.value;
              e.target.setSelectionRange(value.length, value.length);
            }}
          />

          {error ? (
            <p className="w-full text-sm text-red-700">{error}</p>
          ) : null}
        </div>

        <div className="pb-6 flex justify-center gap-8">
          <Button
            onClick={handleSubmit}
            className="w-30"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "rename"
                ? "Guardando..."
                : "Creando..."
              : mode === "rename"
              ? "Aceptar"
              : "Crear plantilla"}
          </Button>

          <Button onClick={handleClose} className="w-23">
            Cancelar
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
