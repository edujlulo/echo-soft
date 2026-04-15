import { supabase } from "@/lib/supabase/client";
import { Database } from "@/types/database";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];
type TextTemplateInsert =
  Database["public"]["Tables"]["text_templates"]["Insert"];

export const FULL_REPORT_TEMPLATE_CATEGORY = "full_report_template";

export async function getFullReportTemplates(
  vetId: string,
): Promise<TextTemplateRow[]> {
  const { data, error } = await supabase
    .from("text_templates")
    .select("*")
    .eq("vet_id", vetId)
    .eq("category", FULL_REPORT_TEMPLATE_CATEGORY)
    .order("updated_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function insertFullReportTemplate(
  template: TextTemplateInsert,
): Promise<TextTemplateRow> {
  const { data, error } = await supabase
    .from("text_templates")
    .insert(template)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
