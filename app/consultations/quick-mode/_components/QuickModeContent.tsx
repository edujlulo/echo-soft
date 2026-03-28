import Button from "@/components/Button";
import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import OrgansTable from "./OrgansTable";

interface Props {
  setIsQuickModeOpen: (open: boolean) => void;
}

export default function QuickModeContent({ setIsQuickModeOpen }: Props) {
  return (
    <>
      <div className="h-full flex flex-row gap-4 ">
        {/* Left section */}
        <div className="h-full  w-[45%] py-2 pl-3 flex flex-col gap-2 ">
          {/* ========== CONSULT LABELED TEXTAREA ========== */}
          <div>
            <ConsultLabeledTextarea>MOTIVOS</ConsultLabeledTextarea>
          </div>

          {/* ========== EDITABLE SELECT LIST ========== */}
          <div className="flex-1 min-h-0">
            <EditableSelectList />
          </div>
        </div>

        {/* Right section  */}
        <div className="w-[55%] flex flex-col gap-1">
          <div className="flex flex-row gap-2 flex-1 min-h-0">
            {/* ========== ORGANS LIST TABLE ========== */}
            <div className="w-[40%] flex-1 min-h-0 pt-2 flex flex-col">
              <OrgansTable />
            </div>

            {/* ========== HELP SECTION ========== */}
            <div className="w-[60%]  pt-2 flex flex-col gap-2">
              <div className="flex-1 min-h-0">
                <ConsultLabeledTextarea textareaHeight={"h-60"}>
                  AYUDA PARA
                </ConsultLabeledTextarea>
              </div>
              <div className="flex-1 min-h-0">
                <ConsultLabeledTextarea textareaHeight={"h-60"}>
                  AYUDA PARA
                </ConsultLabeledTextarea>
              </div>
            </div>
          </div>

          {/* ========== LONG PHRASE OR TEMPLATE ========== */}
          <div>
            <div className="pr-30">
              <ConsultLabeledTextarea>
                FRASE LARGA O PLANTILLA
              </ConsultLabeledTextarea>
            </div>
            {/* Close button */}
            <div className=" flex justify-center">
              <Button
                onClick={() => setIsQuickModeOpen(false)}
                className="w-23"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
