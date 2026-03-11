import { supabase } from "@/lib/supabase/client";

export async function getSignedImageUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from("vet-images")
    .createSignedUrl(filePath, 3600); // 1 hour

  if (error) {
    console.error("Signed URL error:", error);
    return null;
  }

  return data.signedUrl;
}
