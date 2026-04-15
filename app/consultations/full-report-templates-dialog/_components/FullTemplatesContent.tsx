"use client";

import { useState } from "react";
import FullTemplatesTable from "./FullTemplatesTable";
import FullTemplatesTextarea from "./FullTemplatesTextarea";
import FullTemplatesActions from "./FullTemplatesActions";
import NewFullTemplateNameDialog from "./NewFullTemplateNameDialog";
import { useFullReportTemplates } from "@/hooks/useFullReportTemplates";

interface Props {
  setIsFullTemplatesDialogOpen: (open: boolean) => void;
}

export default function FullTemplatesContent({
  setIsFullTemplatesDialogOpen,
}: Props) {
  const [isNewTemplateNameDialogOpen, setIsNewTemplateNameDialogOpen] =
    useState(false);

  const {
    templates,
    selectedTemplate,
    selectedTemplateContent,
    selectTemplateById,
    createTemplateFromCurrentReport,
    loading,
    isCreatingTemplate,
    error,
  } = useFullReportTemplates();

  return (
    <div className="h-full w-full min-h-0 px-10 pt-4 pb-4 flex flex-col gap-4">
      <div className="h-full w-full min-h-0 flex flex-col gap-2">
        <div className="flex-1 min-h-0 w-full flex flex-row gap-3 items-stretch">
          <FullTemplatesTable
            templates={templates}
            selectedTemplateId={selectedTemplate?.id ?? null}
            onSelectTemplate={selectTemplateById}
            loading={loading}
          />

          <div className="h-full min-w-0 flex-1">
            <FullTemplatesTextarea value={selectedTemplateContent} />
          </div>
        </div>

        {error ? <p className="text-sm text-red-700 px-1">{error}</p> : null}

        <FullTemplatesActions
          setIsFullTemplatesDialogOpen={setIsFullTemplatesDialogOpen}
          setIsNewTemplateNameDialogOpen={setIsNewTemplateNameDialogOpen}
        />
      </div>

      <NewFullTemplateNameDialog
        isNewTemplateNameDialogOpen={isNewTemplateNameDialogOpen}
        setIsNewTemplateNameDialogOpen={setIsNewTemplateNameDialogOpen}
        onCreateTemplate={createTemplateFromCurrentReport}
        isCreatingTemplate={isCreatingTemplate}
      />
    </div>
  );
}
