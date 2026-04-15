"use client";

import { useEffect, useMemo, useState } from "react";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useConsultationReportBuilder } from "@/hooks/useConsultationReportBuilder";
import {
  FULL_REPORT_TEMPLATE_CATEGORY,
  getFullReportTemplates,
  insertFullReportTemplate,
} from "@/lib/queries/fullReportTemplates";
import { Database } from "@/types/database";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];
type TextTemplateInsert =
  Database["public"]["Tables"]["text_templates"]["Insert"];

export function useFullReportTemplates() {
  const activeVet = useActiveVetStore((state) => state.activeVet);
  const { report } = useConsultationReportBuilder();

  const [templates, setTemplates] = useState<TextTemplateRow[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TextTemplateRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplateContent = useMemo(() => {
    return selectedTemplate?.full_template_content ?? "";
  }, [selectedTemplate]);

  useEffect(() => {
    const vetId = activeVet?.vet_id;

    if (!vetId) {
      setTemplates([]);
      setSelectedTemplate(null);
      return;
    }

    const safeVetId = vetId;

    let isCancelled = false;

    async function fetchTemplates() {
      setLoading(true);
      setError(null);

      try {
        const data = await getFullReportTemplates(safeVetId);

        if (isCancelled) return;

        setTemplates(data);

        setSelectedTemplate((currentSelected) => {
          if (!currentSelected) return null;

          const updatedSelected = data.find(
            (template) => template.id === currentSelected.id,
          );

          return updatedSelected ?? null;
        });
      } catch (err: any) {
        if (isCancelled) return;

        console.error(err);
        setError(err?.message ?? "Failed to fetch full report templates.");
        setTemplates([]);
        setSelectedTemplate(null);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchTemplates();

    return () => {
      isCancelled = true;
    };
  }, [activeVet?.vet_id]);

  async function refreshTemplates() {
    const vetId = activeVet?.vet_id;

    if (!vetId) {
      setTemplates([]);
      setSelectedTemplate(null);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getFullReportTemplates(vetId);
      setTemplates(data);

      setSelectedTemplate((currentSelected) => {
        if (!currentSelected) return null;

        const updatedSelected = data.find(
          (template) => template.id === currentSelected.id,
        );

        return updatedSelected ?? null;
      });

      return data;
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to refresh full report templates.");
      setTemplates([]);
      setSelectedTemplate(null);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function createTemplateFromCurrentReport(
    rawLabel: string,
  ): Promise<TextTemplateRow | null> {
    const trimmedLabel = rawLabel.trim();

    if (!trimmedLabel) {
      const message = "You must type a template name.";
      setError(message);
      return null;
    }

    const vetId = activeVet?.vet_id;

    if (!vetId) {
      const message = "There is no active vet selected.";
      setError(message);
      return null;
    }

    const trimmedReport = report.trim();

    if (!trimmedReport) {
      const message = "The current report is empty.";
      setError(message);
      return null;
    }

    setIsCreatingTemplate(true);
    setError(null);

    try {
      const payload: TextTemplateInsert = {
        vet_id: vetId,
        category: FULL_REPORT_TEMPLATE_CATEGORY,
        label: trimmedLabel,
        content: null,
        full_template_content: trimmedReport,
      };

      const insertedTemplate = await insertFullReportTemplate(payload);

      const updatedTemplates = await getFullReportTemplates(vetId);

      setTemplates(updatedTemplates);

      const insertedFromFreshList =
        updatedTemplates.find(
          (template) => template.id === insertedTemplate.id,
        ) ?? insertedTemplate;

      setSelectedTemplate(insertedFromFreshList);

      return insertedFromFreshList;
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to create the full report template.");
      return null;
    } finally {
      setIsCreatingTemplate(false);
    }
  }

  function selectTemplateById(templateId: string) {
    const template = templates.find((item) => item.id === templateId) ?? null;
    setSelectedTemplate(template);
  }

  return {
    templates,
    selectedTemplate,
    selectedTemplateContent,
    selectTemplateById,
    setSelectedTemplate,
    createTemplateFromCurrentReport,
    refreshTemplates,
    loading,
    isCreatingTemplate,
    error,
    report,
  };
}
