"use client";

import { useState, useEffect } from "react";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import {
  deleteTextTemplate,
  insertTextTemplate,
  updateTextTemplate,
} from "@/lib/queries/textTemplates";
import { Database } from "@/types/database";
import { useTextTemplatesStore } from "@/context/textTemplatesStore";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];
type TextTemplateInsert =
  Database["public"]["Tables"]["text_templates"]["Insert"];

export function useTemplateActions() {
  // ========== STORES ==========
  const activeCategory = useEditableSelectListStore((s) => s.activeCategory);
  const activeVet = useActiveVetStore((s) => s.activeVet);

  const allTemplates = useTextTemplatesStore((s) => s.templates);
  const templatesLoading = useTextTemplatesStore((s) => s.loading);
  const templatesError = useTextTemplatesStore((s) => s.error);
  const upsertTemplate = useTextTemplatesStore((s) => s.upsertTemplate);
  const removeTemplate = useTextTemplatesStore((s) => s.removeTemplate);

  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const templates = allTemplates.filter(
    (template) => template.category === activeCategory
  );

  // ========== STATES ==========
  const [selectedTemplate, setSelectedTemplate] =
    useState<TextTemplateRow | null>(null);

  // ========== EMPTY TEMPLATE ==========
  const emptyTemplate: TextTemplateInsert = {
    vet_id: "", // se asigna antes de insertar
    category: activeCategory ?? "",
    content: "",
    label: null,
  };

  useEffect(() => {
    setSelectedTemplate(null);
  }, [activeCategory]);

  // ========== INITIALIZE NEW TEMPLATE ==========
  function initAddTemplate(vet_id: string) {
    setSelectedTemplate({ ...emptyTemplate, vet_id } as TextTemplateRow);
  }

  // ========== ADD TEMPLATE TO DB ==========
  async function addTemplate(): Promise<TextTemplateRow | null> {
    if (!selectedTemplate) return null;
    if (!activeCategory) {
      setMutationError("No active category selected.");
      return null;
    }
    if (!selectedTemplate.content || selectedTemplate.content.trim() === "") {
      setMutationError("Content cannot be empty.");
      return null;
    }

    setIsMutating(true);
    setMutationError(null);

    try {
      const templateToInsert: TextTemplateInsert = {
        vet_id: selectedTemplate.vet_id,
        category: activeCategory,
        content: selectedTemplate.content,
        label: selectedTemplate.label ?? null,
      };

      const inserted = await insertTextTemplate(templateToInsert);

      if (inserted) {
        upsertTemplate(inserted);
        setSelectedTemplate(inserted);
      }

      return inserted ?? null;
    } catch (err: any) {
      console.error(err);
      setMutationError(err.message ?? "Failed to add template.");
      return null;
    } finally {
      setIsMutating(false);
    }
  }

  // ========== UPDATE TEMPLATE ============
  async function updateTemplate(): Promise<TextTemplateRow | null> {
    if (!selectedTemplate) return null;

    if (!selectedTemplate.id) return null;

    if (!selectedTemplate.content || selectedTemplate.content.trim() === "") {
      setMutationError("Content cannot be empty.");
      return null;
    }

    setIsMutating(true);
    setMutationError(null);

    try {
      const updated = await updateTextTemplate(
        selectedTemplate.id,
        selectedTemplate.content
      );

      upsertTemplate(updated);
      setSelectedTemplate(updated);

      return updated;
    } catch (err: any) {
      console.error(err);
      setMutationError(err.message ?? "Failed to update template.");
      return null;
    } finally {
      setIsMutating(false);
    }
  }

  // ========== DELETE TEMPLATE ==========
  async function deleteTemplate(): Promise<boolean> {
    if (!selectedTemplate) {
      setMutationError("Debe seleccionar una frase.");
      alert("Debe seleccionar una frase"); // alerta si no hay seleccionado
      return false;
    }

    setIsMutating(true);
    setMutationError(null);

    try {
      await deleteTextTemplate(selectedTemplate.id);

      removeTemplate(selectedTemplate.id);
      setSelectedTemplate(null);

      return true;
    } catch (err: any) {
      console.error(err);
      setMutationError(err.message ?? "Failed to delete template.");
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    initAddTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    loading: isMutating,
    error: mutationError,
    templatesLoading,
    templatesError,
  };
}
