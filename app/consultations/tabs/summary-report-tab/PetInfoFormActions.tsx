import Button from "@/components/Button";
import { useState } from "react";

interface Props {
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
}

export default function PetInfoFormActions({
  setIsFullTemplatesDialogOpen,
}: Props) {
  const [isOn, setIsOn] = useState(false);

  return (
    <>
      <div className="mt-4 flex flex-row gap-40">
        {/* ====== Left section ====== */}
        <div className="ml-4 mt-6 flex flex-col gap-2 justify-center">
          {/* TOGGLE BUTTON FOR FULL REPORT TEMPLATE MODE */}
          <div className="flex flex-row gap-2">
            <p className="font-bold">Modo plantilla completa (edición libre)</p>
            <button
              onClick={() => setIsOn(!isOn)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                isOn ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isOn ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex flex-row gap-1.5">
            <Button onClick={() => setIsFullTemplatesDialogOpen(true)}>
              Plantillas
            </Button>
          </div>
        </div>

        {/* ====== Right section ======= */}

        {/* =============== FOR FUTURE: CONSULTATIONS DUPLICATIONS (MEMORIA) =============== */}
        {/* <div className="flex flex-col gap-1.5">
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
    "
          >
            Mostrar memoria
          </Button>
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
    "
          >
            Añadir memoria al informe
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
    "
            >
              Copiar informe a memoria
            </Button>
            <span className="text-xs text-gray-500 mt-1 ml-1">
              En desarrollo
            </span>
          </div>
        </div> */}
      </div>
    </>
  );
}
