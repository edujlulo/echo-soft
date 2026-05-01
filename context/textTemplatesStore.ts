"use client";

import { create } from "zustand";
import { Database } from "@/types/database";
import { getTextTemplates } from "@/lib/queries/textTemplates";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

interface TextTemplatesState {
  templates: TextTemplateRow[];
  loading: boolean;
  error: string | null;
  loadedVetId: string | null;

  fetchAllTemplates: (vetId: string, force?: boolean) => Promise<void>;
  upsertTemplate: (template: TextTemplateRow) => void;
  removeTemplate: (templateId: string) => void;
  clearTemplates: () => void;
}

export const useTextTemplatesStore = create<TextTemplatesState>((set, get) => ({
  templates: [],
  loading: false,
  error: null,
  loadedVetId: null,

  fetchAllTemplates: async (vetId, force = false) => {
    const { loadedVetId, loading } = get();

    if (!force && loadedVetId === vetId) return;
    if (loading) return;

    set({ loading: true, error: null });

    try {
      const templates = await getTextTemplates(vetId);

      set({
        templates,
        loadedVetId: vetId,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error(err);

      set({
        templates: [],
        loadedVetId: null,
        loading: false,
        error: err.message ?? "Failed to fetch text templates.",
      });
    }
  },

  upsertTemplate: (template) => {
    set((state) => {
      const exists = state.templates.some((item) => item.id === template.id);

      if (exists) {
        return {
          templates: state.templates.map((item) =>
            item.id === template.id ? template : item
          ),
        };
      }

      return {
        templates: [...state.templates, template],
      };
    });
  },

  removeTemplate: (templateId) => {
    set((state) => ({
      templates: state.templates.filter((item) => item.id !== templateId),
    }));
  },

  clearTemplates: () => {
    set({
      templates: [],
      loading: false,
      error: null,
      loadedVetId: null,
    });
  },
}));
