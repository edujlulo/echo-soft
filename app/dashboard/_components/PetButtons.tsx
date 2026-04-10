"use client";

import Button from "@/components/Button";
import { emptyPet, useSelectedPetStore } from "@/context/selectedPetStore";

export default function PetButtons() {
  const { selectedPet, startCreating, startEditing } = useSelectedPetStore();

  return (
    <div className="flex flex-col gap-7">
      <Button className="w-38" onClick={() => startCreating()}>
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
      <div className="flex flex-col items-center">
        <Button
          disabled
          className="
      bg-gray-200 
      border-gray-300 
      text-gray-500 
      cursor-not-allowed 
      hover:bg-gray-200 
      hover:border-gray-300
      opacity-80
      w-38
    "
        >
          Borrar Mascota
        </Button>

        <span className="text-xs text-gray-500 mt-0.5 ml-1">En desarrollo</span>
      </div>
    </div>
  );
}
