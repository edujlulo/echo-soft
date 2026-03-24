import { supabase } from "../supabase/client";
import { Database } from "@/types/database";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];
type TextTemplateInsert =
  Database["public"]["Tables"]["text_templates"]["Insert"];

/**
 * Inserts a new text template into the database.
 * Throws an error if the operation fails.
 */
export async function insertTextTemplate(
  template: TextTemplateInsert,
): Promise<TextTemplateRow> {
  const { data, error } = await supabase
    .from<TextTemplateRow, TextTemplateInsert>("text_templates")
    .insert([template])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to insert text template: ${error.message}`);
  }

  return data;
}

/**
 * Fetches text templates filtered by vet_id and optional category.
 * Throws an error if the operation fails.
 */
export async function getTextTemplates(
  vet_id: string,
  category?: string,
): Promise<TextTemplateRow[]> {
  let query = supabase
    .from<TextTemplateRow, TextTemplateInsert>("text_templates")
    .select("*")
    .eq("vet_id", vet_id);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch text templates: ${error.message}`);
  }

  return data;
}
