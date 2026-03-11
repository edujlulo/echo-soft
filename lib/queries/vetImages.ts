import { Database } from "@/types/database";
import { supabase } from "../supabase/client";

export type VetImage =
  Database["public"]["Tables"]["veterinarian_images"]["Row"];
export type VetImageType = Database["public"]["Enums"]["vet_image_type"];

export interface SignedVetImages {
  profile: string | null;
  signature: string | null;
  other: string[];
}

// Traer imágenes y generar signed URLs
export async function getVetImagesWithSignedUrls(
  vetId: string,
): Promise<SignedVetImages> {
  const { data, error } = await supabase
    .from("veterinarian_images")
    .select("*")
    .eq("vet_id", vetId);

  if (error) throw new Error(error.message);

  console.log("Raw image rows from DB:", data);

  if (!data) return { profile: null, signature: null, other: [] };

  const signedUrls = await Promise.all(
    data.map(async (img) => {
      if (!img.file_path) return null;
      const { data: urlData, error: urlError } = await supabase.storage
        .from("vet-images")
        .createSignedUrl(img.file_path, 3600); // URL válido 1 hora
      if (urlError) return null;
      return { type: img.image_type, url: urlData.signedUrl };
    }),
  );

  const result: SignedVetImages = { profile: null, signature: null, other: [] };
  signedUrls.forEach((item) => {
    if (!item) return;
    if (item.type === "profile") result.profile = item.url;
    else if (item.type === "signature") result.signature = item.url;
    else result.other.push(item.url!);
  });

  return result;
}

// Subir imagen al bucket y registrar en la tabla (sin autenticación)
export async function uploadVetImage(
  vetId: string,
  file: File,
  type: VetImageType,
  description: string | null = null,
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${type}.${fileExt}`;
  const filePath = `${vetId}/${fileName}`;

  // Subir al bucket
  const { error: uploadError } = await supabase.storage
    .from("vet-images")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Error uploading to storage:", uploadError);
    return null;
  }

  // Revisar si ya existe una imagen de este tipo para este veterinario
  const { data: existingImage } = await supabase
    .from("veterinarian_images")
    .select("*")
    .eq("vet_id", vetId)
    .eq("image_type", type)
    .maybeSingle(); // devuelve null si no existe

  let dbError;

  if (existingImage) {
    // Si existe, actualizamos la fila con la nueva file_path y description
    const { error } = await supabase
      .from("veterinarian_images")
      .update({ file_path: filePath, description })
      .eq("id", existingImage.id);
    dbError = error;
  } else {
    // Si no existe, insertamos como antes
    const { error } = await supabase.from("veterinarian_images").insert([
      {
        vet_id: vetId,
        user_id: null,
        file_path: filePath,
        image_type: type,
        description,
      },
    ]);
    dbError = error;
  }

  if (dbError) {
    console.error(
      "Error inserting/updating veterinarian_images table:",
      dbError,
    );
    return null;
  }

  // Generar signed URL para frontend
  const { data: urlData, error: urlError } = await supabase.storage
    .from("vet-images")
    .createSignedUrl(filePath, 60);

  if (urlError) {
    console.error("Error creating signed URL:", urlError);
    return null;
  }

  return urlData.signedUrl;
}
