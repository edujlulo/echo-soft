"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useConsultationReportBuilder } from "@/hooks/useConsultationReportBuilder";
import {
  FULL_REPORT_TEMPLATE_CATEGORY,
  deleteFullReportTemplate,
  getFullReportTemplates,
  insertFullReportTemplate,
  updateFullReportTemplateContent,
  updateFullReportTemplateLabel,
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

  const [draftContent, setDraftContent] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingContentRef = useRef(false);
  const queuedSaveRef = useRef(false);
  const latestDraftContentRef = useRef("");
  const lastSavedContentRef = useRef("");
  const selectedTemplateIdRef = useRef<string | null>(null);

  const selectedTemplateContent = useMemo(() => {
    return selectedTemplate?.full_template_content ?? "";
  }, [selectedTemplate]);

  useEffect(() => {
    latestDraftContentRef.current = draftContent;
  }, [draftContent]);

  useEffect(() => {
    const nextTemplateId = selectedTemplate?.id ?? null;
    const nextContent = selectedTemplate?.full_template_content ?? "";

    selectedTemplateIdRef.current = nextTemplateId;
    setDraftContent(nextContent);
    lastSavedContentRef.current = nextContent;
    latestDraftContentRef.current = nextContent;
  }, [selectedTemplate?.id, selectedTemplate?.full_template_content]);

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
            (template) => template.id === currentSelected.id
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
          (template) => template.id === currentSelected.id
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
    rawLabel: string
  ): Promise<TextTemplateRow | null> {
    const trimmedLabel = rawLabel.trim();

    if (!trimmedLabel) {
      // const message = "You must type a template name.";
      const message = "Debe seleccionar una plantilla primero.";
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
          (template) => template.id === insertedTemplate.id
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

  async function saveSelectedTemplateContentNow(): Promise<void> {
    const templateId = selectedTemplateIdRef.current;
    const currentDraftContent = latestDraftContentRef.current;
    const lastSavedContent = lastSavedContentRef.current;

    if (!templateId) return;
    if (currentDraftContent === lastSavedContent) return;

    if (isSavingContentRef.current) {
      queuedSaveRef.current = true;
      return;
    }

    isSavingContentRef.current = true;
    setIsSavingContent(true);
    queuedSaveRef.current = false;

    const contentSnapshot = currentDraftContent;

    try {
      const updatedTemplate = await updateFullReportTemplateContent(
        templateId,
        contentSnapshot
      );

      setTemplates((currentTemplates) =>
        currentTemplates.map((template) =>
          template.id === updatedTemplate.id
            ? {
                ...template,
                full_template_content: updatedTemplate.full_template_content,
                updated_at: updatedTemplate.updated_at,
              }
            : template
        )
      );

      setSelectedTemplate((currentSelected) => {
        if (!currentSelected) return currentSelected;
        if (currentSelected.id !== updatedTemplate.id) return currentSelected;

        return {
          ...currentSelected,
          full_template_content: updatedTemplate.full_template_content,
          updated_at: updatedTemplate.updated_at,
        };
      });

      if (latestDraftContentRef.current === contentSnapshot) {
        lastSavedContentRef.current = contentSnapshot;
      } else {
        queuedSaveRef.current = true;
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to save the full template content.");
      queuedSaveRef.current = true;
    } finally {
      isSavingContentRef.current = false;
      setIsSavingContent(false);

      if (queuedSaveRef.current) {
        queuedSaveRef.current = false;
        void saveSelectedTemplateContentNow();
      }
    }
  }

  useEffect(() => {
    if (!selectedTemplate?.id) return;

    if (draftContent === lastSavedContentRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveSelectedTemplateContentNow();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [draftContent, selectedTemplate?.id]);

  async function flushSelectedTemplateContentSave(): Promise<void> {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    await saveSelectedTemplateContentNow();
  }

  function updateDraftContent(value: string) {
    setDraftContent(value);
  }

  async function deleteSelectedTemplate(): Promise<boolean> {
    if (!selectedTemplate?.id) {
      // const message = "You must select a template first.";
      const message = "Debe seleccionar una plantilla primero.";
      setError(message);
      alert(message);
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const deletedTemplateId = selectedTemplate.id;

      await deleteFullReportTemplate(deletedTemplateId);

      setTemplates((currentTemplates) =>
        currentTemplates.filter((template) => template.id !== deletedTemplateId)
      );

      setSelectedTemplate(null);
      setDraftContent("");
      lastSavedContentRef.current = "";
      latestDraftContentRef.current = "";
      selectedTemplateIdRef.current = null;

      return true;
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to delete the full report template.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function renameSelectedTemplate(
    rawLabel: string
  ): Promise<TextTemplateRow | null> {
    const trimmedLabel = rawLabel.trim();

    if (!trimmedLabel) {
      const message = "Debe escribir un nombre para la plantilla.";
      setError(message);
      return null;
    }

    if (!selectedTemplate?.id) {
      const message = "Debe seleccionar una plantilla.";
      setError(message);
      alert(message);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedTemplate = await updateFullReportTemplateLabel(
        selectedTemplate.id,
        trimmedLabel
      );

      setTemplates((currentTemplates) =>
        currentTemplates.map((template) =>
          template.id === updatedTemplate.id ? updatedTemplate : template
        )
      );

      setSelectedTemplate(updatedTemplate);

      return updatedTemplate;
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to rename the full report template.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function selectTemplateById(templateId: string) {
    if (templateId === selectedTemplateIdRef.current) {
      return;
    }

    await flushSelectedTemplateContentSave();

    const template = templates.find((item) => item.id === templateId) ?? null;
    setSelectedTemplate(template);
  }

  return {
    templates,
    selectedTemplate,
    selectedTemplateContent,
    draftContent,
    updateDraftContent,
    flushSelectedTemplateContentSave,
    isSavingContent,
    selectTemplateById,
    setSelectedTemplate,
    createTemplateFromCurrentReport,
    deleteSelectedTemplate,
    renameSelectedTemplate,
    refreshTemplates,
    loading,
    isCreatingTemplate,
    error,
    report,
  };
}
