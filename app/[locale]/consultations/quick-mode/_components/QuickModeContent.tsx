import Button from "@/components/Button";
import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import EditableSelectList from "@/components/EditableSelectList";
import OrgansTable from "./OrgansTable";
import DynamicTextarea from "./DynamicTextarea";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import QuickModeReportDraft from "./QuickModeReportDraft";
import { useTranslations } from "next-intl";

interface Props {
  setIsQuickModeOpen: (open: boolean) => void;
}

export default function QuickModeContent({ setIsQuickModeOpen }: Props) {
  const t = useTranslations("QuickModeSection");

  const { setFieldConsultation } = useConsultationForm();

  return (
    <>
      <div className="h-full flex flex-row gap-4 ">
        {/* Left section */}
        <div className="h-full  w-[45%] py-2 pl-3 flex flex-col gap-2 ">
          {/* ========== CONSULT LABELED TEXTAREA ========== */}
          <DynamicTextarea />

          {/* ========== EDITABLE SELECT LIST ========== */}
          <div className="flex-1 min-h-0 relative">
            <EditableSelectList
              setFieldConsultation={setFieldConsultation}
              buttonsClassName="justify-start"
            />

            {/* Close button */}
            <div className="absolute bottom-4 right-5 z-10">
              <Button
                onClick={() => setIsQuickModeOpen(false)}
                className="w-23"
              >
                {t("close")}
              </Button>
            </div>
          </div>
        </div>

        {/* Right section  */}
        <div className="w-[55%] flex flex-col gap-1">
          <div className="flex flex-row gap-2 flex-1 min-h-0">
            {/* ========== ORGANS LIST TABLE ========== */}
            <div className="w-[40%] mb-0.5 flex-1 min-h-0 pt-2 flex flex-col">
              <OrgansTable />
            </div>

            {/* ========== REPORT DRAFT ========== */}
            <div className="w-[60%] pt-2 flex flex-col gap-2">
              <QuickModeReportDraft />
            </div>

            {/* ========== HELP SECTION ========== */}
            {/* <div className="w-[60%]  pt-2 flex flex-col gap-2">
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
            </div> */}
          </div>

          {/* ========== LONG PHRASE OR TEMPLATE ========== */}
          <div>
            <div className="mb-2 pr-30">
              <ConsultLabeledTextarea>
                {t("longPhraseOrTemplate")}
              </ConsultLabeledTextarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
