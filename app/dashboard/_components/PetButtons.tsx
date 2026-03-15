"use client";

import Button from "@/components/Button";
import { emptyPet, useSelectedPetStore } from "@/context/selectedPetStore";

export default function PetButtons() {
  const { selectedPet, startCreating, startEditing } = useSelectedPetStore();

  return (
    <div className="flex flex-col gap-7">
      <Button className="w-38" onClick={startCreating}>
        Nueva Mascota
      </Button>
      <Button
        onClick={() => {
          if (
            !selectedPet ||
            JSON.stringify(selectedPet) === JSON.stringify(emptyPet)
          ) {
            window.alert("Por favor seleccione una mascota");
            return;
          }

          startEditing();
        }}
      >
        Modificar Mascota
      </Button>
      <Button onClick={() => window.alert("Acción en construcción")}>
        Borrar Mascota
      </Button>
    </div>
  );
}
