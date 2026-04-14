import Button from "@/components/Button";

interface Props {
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
}

export default function PetInfoFormActions({
  setIsFullTemplatesDialogOpen,
}: Props) {
  return (
    <>
      <div className="mt-4 flex flex-row gap-40">
        {/* ====== Left section ====== */}
        <div className="ml-4 mt-6 flex flex-col gap-1.5 justify-center">
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
