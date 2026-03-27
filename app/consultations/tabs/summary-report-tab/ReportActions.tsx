import Button from "@/components/Button";

interface Props {
  setIsQuickModeOpen: (open: boolean) => void;
}

export default function ReportActions({ setIsQuickModeOpen }: Props) {
  const reportActionsButtonsClassName =
    "font-bold bg-green-200 border-green-400 hover:bg-green-300 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="ml-10 flex flex-col gap-1">
          <Button className={reportActionsButtonsClassName}>
            Sumario carta
          </Button>
          <Button className={reportActionsButtonsClassName}>
            Sumario oficio
          </Button>
        </div>
        <div className="mr-105 flex flex-col gap-1">
          <Button className={reportActionsButtonsClassName}>
            Una imagen por hoja
          </Button>
          <Button className={reportActionsButtonsClassName}>
            Una imagen por hoja
          </Button>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Button className={reportActionsButtonsClassName}>Imprimir 2</Button>
          <Button className={reportActionsButtonsClassName}>2</Button>
          <Button
            className={reportActionsButtonsClassName}
            onClick={() => setIsQuickModeOpen(true)}
          >
            Modo rápido
          </Button>
          <Button className={reportActionsButtonsClassName}>
            Modo rápido con ayuda
          </Button>
          <Button className={reportActionsButtonsClassName}>Solo ayuda</Button>
        </div>
      </div>
    </>
  );
}
