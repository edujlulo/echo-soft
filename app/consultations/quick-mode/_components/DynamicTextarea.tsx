import ConsultLabeledTextarea from "@/components/ConsultLabeledTextarea";
import { useConsultationForm } from "@/hooks/useConsultationForm";

export default function DynamicTextarea() {
  const { formConsultation, setFieldConsultation } = useConsultationForm();

  // FUNCTION FOR FORMAT TEXT FOR DISPLAY
  const SEP = "\u{241F}"; // separador invisible

  function formatForDisplay(text: string) {
    return text.replaceAll(SEP, ", "); // separador visible para el usuario
  }

  return (
    <div>
      <ConsultLabeledTextarea
        categoryKey="liver"
        value={formatForDisplay(formConsultation?.liver ?? "")}
        onChange={(e) => setFieldConsultation("liver", e.target.value)}
      >
        HÍGADO
      </ConsultLabeledTextarea>
    </div>
  );
}
