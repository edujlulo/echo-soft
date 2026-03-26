"use client";

import { useState, useEffect } from "react";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import {
  deleteTextTemplate,
  getTextTemplates,
  insertTextTemplate,
  updateTextTemplate,
} from "@/lib/queries/textTemplates";
import { Database } from "@/types/database";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];
type TextTemplateInsert =
  Database["public"]["Tables"]["text_templates"]["Insert"];

export function useTemplateActions() {
  // ========== STORES ==========
  const activeCategory = useEditableSelectListStore((s) => s.activeCategory);
  const activeVet = useActiveVetStore((s) => s.activeVet);

  // ========== STATES ==========
  const [templates, setTemplates] = useState<TextTemplateRow[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TextTemplateRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== EMPTY TEMPLATE ==========
  const emptyTemplate: TextTemplateInsert = {
    vet_id: "", // se asigna antes de insertar
    category: activeCategory ?? "",
    content: "",
    label: null,
  };

  // ========== FETCH TEMPLATES ==========
  useEffect(() => {
    if (!activeCategory || !activeVet) {
      setTemplates([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTextTemplates(activeVet.vet_id, activeCategory);
        if (!signal.aborted) setTemplates(data);
      } catch (err: any) {
        if (!signal.aborted) {
          console.error(err);
          setError(err.message ?? "Failed to fetch text templates");
          setTemplates([]);
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchTemplates();

    return () => controller.abort();
  }, [activeCategory, activeVet]);

  // ========== INITIALIZE NEW TEMPLATE ==========
  function initAddTemplate(vet_id: string) {
    setSelectedTemplate({ ...emptyTemplate, vet_id } as TextTemplateRow);
  }

  // ========== ADD TEMPLATE TO DB ==========
  async function addTemplate(): Promise<TextTemplateRow | null> {
    if (!selectedTemplate) return null;
    if (!activeCategory) {
      setError("No active category selected.");
      return null;
    }
    if (!selectedTemplate.content || selectedTemplate.content.trim() === "") {
      setError("Content cannot be empty.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const templateToInsert: TextTemplateInsert = {
        vet_id: selectedTemplate.vet_id,
        category: activeCategory,
        content: selectedTemplate.content,
        label: selectedTemplate.label ?? null,
      };

      const inserted = await insertTextTemplate(templateToInsert);

      if (inserted && activeVet && activeCategory) {
        // Después de insertar, hacemos fetch completo
        const data = await getTextTemplates(activeVet.vet_id, activeCategory);
        setTemplates(data); // actualizar tabla con los datos reales
        setSelectedTemplate(inserted); // New insert will be selectedTemplate
      }

      return inserted ?? null;
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to add template.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // ========== UPDATE TEMPLATE ============
  async function updateTemplate(): Promise<TextTemplateRow | null> {
    if (!selectedTemplate) return null;

    if (!selectedTemplate.id) return null;

    if (!selectedTemplate.content || selectedTemplate.content.trim() === "") {
      setError("Content cannot be empty.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const updated = await updateTextTemplate(
        selectedTemplate.id,
        selectedTemplate.content,
      );

      if (activeVet && activeCategory) {
        const data = await getTextTemplates(activeVet.vet_id, activeCategory);

        setTemplates(data);
        setSelectedTemplate(updated);
      }

      return updated;
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to update template.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // ========== DELETE TEMPLATE ==========
  async function deleteTemplate(): Promise<boolean> {
    if (!selectedTemplate) {
      setError("Debe seleccionar una frase.");
      alert("Debe seleccionar una frase"); // alerta si no hay seleccionado
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteTextTemplate(selectedTemplate.id);

      if (activeVet && activeCategory) {
        const data = await getTextTemplates(activeVet.vet_id, activeCategory);
        setTemplates(data); // actualizar tabla con los datos reales
        setSelectedTemplate(null); // limpiar selección
      }

      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to delete template.");
      return false;
    } finally {
      setLoading(false);
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
    loading,
    error,
  };
}
