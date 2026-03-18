import Button from "@/components/Button";

export default function PetInfoFormActions() {
  return (
    <>
      <div className="mt-4 flex flex-row gap-40">
        {/* ====== Left section ====== */}
        <div className="ml-4 flex flex-col gap-1.5 justify-center">
          <div className="flex flex-row gap-1.5">
            <Button>Plantillas</Button>
            <Button>Plantillas por órganos</Button>
          </div>
          <Button>Ayuda cuadro de gestación</Button>
        </div>

        {/* ====== Right section ======= */}
        <div className="flex flex-col gap-1.5">
          <Button>Mostrar memoria</Button>
          <Button>Añadir memoria al informe</Button>
          <Button>Copiar informe a memoria</Button>
        </div>
      </div>
    </>
  );
}
