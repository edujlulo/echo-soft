"use client";

import Button from "@/components/Button";
import React from "react";

interface Props {
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
  setIsNewTemplateNameDialogOpen: (open: boolean) => void;
}

export default function FullTemplatesActions({
  setIsFullTemplatesDialogOpen,
  setIsNewTemplateNameDialogOpen,
}: Props) {
  return (
    <div className="py-3 flex flex-row gap-3 justify-center items-center">
      <Button>Eliminar plantilla</Button>
      <Button onClick={() => setIsNewTemplateNameDialogOpen(true)}>
        Crear una plantilla nueva a partir de este informe
      </Button>
      <Button>Añadir plantilla seleccionada al informe</Button>
      <Button
        onClick={() => setIsFullTemplatesDialogOpen(false)}
        className="w-23"
      >
        Salir
      </Button>
    </div>
  );
}
