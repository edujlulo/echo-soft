"use client";

import { useState } from "react";
import FullTemplatesTable from "./FullTemplatesTable";
import FullTemplatesTextarea from "./FullTemplatesTextarea";
import FullTemplatesActions from "./FullTemplatesActions";
import NewFullTemplateNameDialog from "./NewFullTemplateNameDialog";
import { useFullReportTemplates } from "@/hooks/useFullReportTemplates";
import { useConsultationStore } from "@/context/consultationStore";
import { updateConsultation } from "@/lib/queries/consultations";

interface Props {
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
}

export default function FullTemplatesContent({
  setIsFullTemplatesDialogOpen,
}: Props) {
  const [isNewTemplateNameDialogOpen, setIsNewTemplateNameDialogOpen] =
    useState(false);
  const [templateNameDialogMode, setTemplateNameDialogMode] = useState<
    "create" | "rename"
  >("create");

  const setReportMode = useConsultationStore((state) => state.setReportMode);
  const loadManualReportDraft = useConsultationStore(
    (state) => state.loadManualReportDraft
  );
  const reportMode = useConsultationStore((state) => state.reportMode);
  const manualReportDraft = useConsultationStore(
    (state) => state.manualReportDraft
  );
  const selectedConsultation = useConsultationStore(
    (state) => state.selectedConsultation
  );
  const setSelectedConsultation = useConsultationStore(
    (state) => state.setSelectedConsultation
  );

  const {
    templates,
    selectedTemplate,
    draftContent,
    updateDraftContent,
    flushSelectedTemplateContentSave,
    isSavingContent,
    selectTemplateById,
    createTemplateFromCurrentReport,
    deleteSelectedTemplate,
    renameSelectedTemplate,
    loading,
    isCreatingTemplate,
    error,
  } = useFullReportTemplates();

  async function handleCloseDialog() {
    await flushSelectedTemplateContentSave();
    setIsFullTemplatesDialogOpen(false);
  }

  function buildNextManualReportDraft(
    currentReport: string,
    templateToAdd: string
  ): string {
    const trimmedCurrentReport = currentReport.trim();
    const trimmedTemplateToAdd = templateToAdd.trim();

    if (!trimmedCurrentReport) {
      return trimmedTemplateToAdd;
    }

    if (!trimmedTemplateToAdd) {
      return trimmedCurrentReport;
    }

    return `${trimmedCurrentReport}\n\n${trimmedTemplateToAdd}`;
  }

  async function handleAddSelectedTemplateToReport() {
    if (!selectedTemplate) {
      alert("Debe seleccionar una plantilla.");
      return;
    }

    await flushSelectedTemplateContentSave();

    const nextManualReportDraft =
      reportMode === "full-template"
        ? buildNextManualReportDraft(manualReportDraft, draftContent)
        : draftContent.trim();

    loadManualReportDraft(nextManualReportDraft);
    setReportMode("full-template");

    if (selectedConsultation?.consultation_id) {
      try {
        const updated = await updateConsultation(
          selectedConsultation.consultation_id,
          {
            report_mode: "full-template",
            manual_report_draft: nextManualReportDraft,
          }
        );

        setSelectedConsultation(updated);
      } catch (error) {
        console.error("Failed to attach template to consultation:", error);
      }
    }

    setIsFullTemplatesDialogOpen(false);
  }

  return (
    <div className="h-full w-full min-h-0 px-10 pt-4 pb-4 flex flex-col gap-4">
      <button
        onClick={handleCloseDialog}
        className="pt-0.5 absolute top-2 right-3 z-50 w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md border border-gray-500 transition-colors text-2xl"
      >
        ×
      </button>
      <div className="h-full w-full min-h-0 flex flex-col gap-2">
        <div className="flex-1 min-h-0 w-full flex flex-row gap-3 items-stretch">
          <FullTemplatesTable
            templates={templates}
            selectedTemplateId={selectedTemplate?.id ?? null}
            onSelectTemplate={selectTemplateById}
            loading={loading}
          />

          <div className="h-full min-w-0 flex-1">
            <FullTemplatesTextarea
              value={draftContent}
              onChange={updateDraftContent}
            />
          </div>
        </div>

        {selectedTemplate ? (
          <p className="text-sm text-blue-900 px-1">
            {isSavingContent ? "Guardando contenido..." : "Contenido listo"}
          </p>
        ) : null}

        {error ? <p className="text-sm text-red-700 px-1">{error}</p> : null}

        <FullTemplatesActions
          onDeleteSelectedTemplate={deleteSelectedTemplate}
          onCloseDialog={handleCloseDialog}
          onOpenCreateDialog={() => {
            setTemplateNameDialogMode("create");
            setIsNewTemplateNameDialogOpen(true);
          }}
          onOpenRenameDialog={() => {
            if (!selectedTemplate) {
              alert("Debe seleccionar una plantilla.");
              return;
            }

            setTemplateNameDialogMode("rename");
            setIsNewTemplateNameDialogOpen(true);
          }}
          onAddSelectedTemplateToReport={handleAddSelectedTemplateToReport}
        />
      </div>

      <NewFullTemplateNameDialog
        isNewTemplateNameDialogOpen={isNewTemplateNameDialogOpen}
        setIsNewTemplateNameDialogOpen={setIsNewTemplateNameDialogOpen}
        mode={templateNameDialogMode}
        initialValue={selectedTemplate?.label ?? ""}
        onCreateTemplate={createTemplateFromCurrentReport}
        onRenameTemplate={renameSelectedTemplate}
        isSubmitting={isCreatingTemplate || loading}
      />
    </div>
  );
}
