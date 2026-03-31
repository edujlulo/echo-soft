import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";

export default function DynamicTextarea() {
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
            ? formatForDisplay(formConsultation?.[activeCategory] ?? "")
            : ""
        }
        onChange={(e) => {
          if (!activeCategory) return;
          setFieldConsultation(activeCategory, e.target.value);
        }}
      >
        {activeField ?? "MOTIVOS"}
      </ConsultLabeledTextarea>
    </div>
  );
}
