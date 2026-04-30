import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { Database } from "@/types/database";
import { useTranslations } from "next-intl";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

export default function DynamicTextarea() {
  const t = useTranslations("QuickModeSection");

  const { formConsultation, setFieldConsultation } = useConsultationForm();

  const activeCategory = useEditableSelectListStore(
    (state) => state.activeCategory
  );

  const activeField = useEditableSelectListStore((state) => state.activeField);

  // FUNCTION FOR FORMAT TEXT FOR DISPLAY
  const SEP = "\u{241F}"; // separador invisible

  function formatForDisplay(text: string) {
    return text.replaceAll(SEP, ", "); // separador visible para el usuario
  }

  return (
    <div>
      <ConsultLabeledTextarea
        categoryKey={activeCategory ?? undefined}
        value={
          activeCategory
            ? formatForDisplay(
                formConsultation?.[activeCategory as keyof ConsultationRow] ??
                  ""
              )
            : ""
        }
        onChange={(e) => {
          if (!activeCategory) return;
          setFieldConsultation(
            activeCategory as keyof ConsultationRow,
            e.target.value
          );
        }}
      >
        {activeField ?? t("defaultReason")}
      </ConsultLabeledTextarea>
    </div>
  );
}
