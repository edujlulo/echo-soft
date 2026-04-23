type PdfNamePet = {
  name?: string | null;
  owner?: string | null;
};

type PdfNameConsultation = {
  consultation_date?: string | null;
};

export function formatDateForPdfName(dateValue?: string | null) {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function buildSuggestedPdfName(
  selectedPet?: PdfNamePet | null,
  consultation?: PdfNameConsultation | null,
) {
  const parts = [
    selectedPet?.name,
    selectedPet?.owner,
    "ECOGRAFIA",
    formatDateForPdfName(consultation?.consultation_date),
  ]
    .map((part) => part?.trim())
    .filter(Boolean);

  return parts.join(" - ");
}

export function sanitizePdfFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/-+/g, "-");
}

export function ensurePdfExtension(fileName: string) {
  return fileName.toLowerCase().endsWith(".pdf") ? fileName : `${fileName}.pdf`;
}

export function getPdfDownloadFileName(fileName?: string | null) {
  const cleanName = sanitizePdfFileName(fileName || "Ecosoft-report");
  return ensurePdfExtension(cleanName || "Ecosoft-report");
}
