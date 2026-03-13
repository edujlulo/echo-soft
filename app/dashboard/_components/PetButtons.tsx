"use client";

import Button from "@/components/Button";
import { useSelectedPetStore } from "@/context/selectedPetStore";

export default function PetButtons() {
  const { startCreating, startEditing } = useSelectedPetStore();

  return (
    <div className="flex flex-col gap-7">
      <Button className="w-38" onClick={startCreating}>
        Nueva Mascota
      </Button>
      <Button onClick={startEditing}>Modificar Mascota</Button>
      <Button>Borrar Mascota</Button>
    </div>
  );
}
