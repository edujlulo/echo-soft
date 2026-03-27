import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";

export default function QuickModeContent() {
  return (
    <>
      <div className="flex flex-rox gap-4">
        {/* Left section */}
        <div className="flex flex-col gap-2">
          {/* ========== CONSULT LABELED TEXTAREA ========== */}
          <div>
            <ConsultLabeledTextarea>MOTIVOS</ConsultLabeledTextarea>
          </div>

          {/* ========== EDITABLE SELECT LIST ========== */}
          <div>
            <EditableSelectList />
          </div>
        </div>

        {/* Right section  */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-2">
            {/* ========== ORGANS LIST TABLE ========== */}
            <div>
              <p>ORGANS LIST TABLE</p>
            </div>

            {/* ========== HELP SECTION ========== */}
            <div className="flex flex-col gap-2">
              <div>
                <ConsultLabeledTextarea>AYUDA PARA</ConsultLabeledTextarea>
              </div>
              <div>
                <ConsultLabeledTextarea>AYUDA PARA</ConsultLabeledTextarea>
              </div>
            </div>
          </div>

          {/* ========== LONG PHRASE OR TEMPLATE ========== */}
          <div>
            <ConsultLabeledTextarea>
              FRASE LARGA O PLANTILLA
            </ConsultLabeledTextarea>
          </div>
        </div>
      </div>
    </>
  );
}
