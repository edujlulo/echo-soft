"use client";

import Button from "@/components/Button";
import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  onDeleteSelectedTemplate: () => Promise<boolean>;
  onCloseDialog: () => Promise<void>;
  onOpenCreateDialog: () => void;
  onOpenRenameDialog: () => void;
  onAddSelectedTemplateToReport: () => Promise<void>;
}

export default function FullTemplatesActions({
  onDeleteSelectedTemplate,
  onCloseDialog,
  onOpenCreateDialog,
  onOpenRenameDialog,
  onAddSelectedTemplateToReport,
}: Props) {
  const t = useTranslations("FullReportTemplatesDialog");

  return (
    <div className="py-3 flex flex-row gap-3 justify-center items-center">
      <Button
        onClick={async () => {
          await onDeleteSelectedTemplate();
        }}
      >
        {t("deleteTemplate")}
      </Button>
      <Button onClick={onOpenCreateDialog}>
        {t("createTemplateFromReport")}
      </Button>
      <Button onClick={onOpenRenameDialog}>{t("rename")}</Button>
      <Button
        onClick={async () => {
          await onAddSelectedTemplateToReport();
        }}
      >
        {t("addSelectedTemplateToReport")}
      </Button>
      <Button onClick={onCloseDialog} className="w-23">
        {t("exit")}
      </Button>
    </div>
  );
}
