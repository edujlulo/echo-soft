"use client";

import Button from "@/components/Button";
import React from "react";

interface Props {
  onDeleteSelectedTemplate: () => Promise<boolean>;
  onCloseDialog: () => Promise<void>;
  onOpenCreateDialog: () => void;
  onOpenRenameDialog: () => void;
  onAddSelectedTemplateToReport: () => Promise<void>;
}

export default function FullTemplatesActions({
  onDeleteSelectedTemplate,
  onCloseDialog,
  onOpenCreateDialog,
  onOpenRenameDialog,
  onAddSelectedTemplateToReport,
}: Props) {
  return (
    <div className="py-3 flex flex-row gap-3 justify-center items-center">
      <Button
        onClick={async () => {
          await onDeleteSelectedTemplate();
        }}
      >
        Eliminar plantilla
      </Button>
      <Button onClick={onOpenCreateDialog}>
        Crear una plantilla nueva a partir de este informe
      </Button>
      <Button onClick={onOpenRenameDialog}>Modificar nombre</Button>
      <Button
        onClick={async () => {
          await onAddSelectedTemplateToReport();
        }}
      >
        Añadir plantilla seleccionada al informe
      </Button>
      <Button onClick={onCloseDialog} className="w-23">
        Salir
      </Button>
    </div>
  );
}
