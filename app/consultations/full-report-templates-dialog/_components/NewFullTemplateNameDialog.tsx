"use client";

import React, { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Database } from "@/types/database";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

interface Props {
  isNewTemplateNameDialogOpen: boolean;
  setIsNewTemplateNameDialogOpen: (open: boolean) => void;
  onCreateTemplate: (label: string) => Promise<TextTemplateRow | null>;
  isCreatingTemplate: boolean;
}

export default function NewFullTemplateNameDialog({
  isNewTemplateNameDialogOpen,
  setIsNewTemplateNameDialogOpen,
  onCreateTemplate,
  isCreatingTemplate,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setTemplateName("");
    setError(null);
    setIsNewTemplateNameDialogOpen(false);
  }

  async function handleCreateTemplate() {
    const trimmedName = templateName.trim();

    if (!trimmedName) {
      setError("You must type a template name.");
      return;
    }

    const createdTemplate = await onCreateTemplate(trimmedName);

    if (!createdTemplate) {
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
          <Navbar>Create template</Navbar>
        </div>

        <div className="py-4 px-20 flex flex-col gap-2 justify-center items-center">
          <Dialog.Title className="text-lg font-semibold mb-2">
            New template name
          </Dialog.Title>

          <input
            ref={inputRef}
            value={templateName}
            onChange={(e) => {
              setTemplateName(e.target.value);
              if (error) {
                setError(null);
              }
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await handleCreateTemplate();
              }
            }}
            className="w-full border rounded p-2 bg-white"
            autoFocus
            placeholder="Type a name..."
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
            onClick={handleCreateTemplate}
            className="w-30"
            disabled={isCreatingTemplate}
          >
            {isCreatingTemplate ? "Creating..." : "Create template"}
          </Button>

          <Button onClick={handleClose} className="w-23">
            Cancel
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
