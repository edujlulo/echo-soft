import { supabase } from "../supabase/client";
import { Database } from "@/types/database";

export type Pet = Database["public"]["Tables"]["pets"]["Row"];

export type PetImageType = "profile";

export interface PetImages {
  profile: string | null;
}

// =========================
// GET IMAGE (bucket público)
// =========================

export async function getPetImages(
  petId: string,
  imagePath: string | null,
): Promise<PetImages> {
  if (!imagePath) {
    return { profile: null };
  }

  // const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/${imagePath}`;

  // Force to be always the right image:
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/${imagePath}?ts=${Date.now()}`;

  return {
    profile: publicUrl,
  };
}

// =========================
// UPLOAD IMAGE
// =========================

export async function uploadPetImage(
  petId: string,
  file: File,
  type: PetImageType,
): Promise<string | null> {
  // const fileExt = file.name.split(".").pop();

  // Force to be all images with .jpg extension:
  const fileExt = "jpg";

  // pet_id/profile.jpg
  const fileName = `${type}.${fileExt}`;
  const filePath = `${petId}/${fileName}`;

  // upload to storage (bucket público)
  const { error: uploadError } = await supabase.storage
    .from("pet-images")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  // update pets.image_path
  const { error: dbError } = await supabase
    .from("pets")
    .update({
      image_path: filePath,
    })
    .eq("pet_id", petId);

  if (dbError) {
    console.error("DB error:", dbError);
    return null;
  }

  // return public url
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/${filePath}`;

  return publicUrl;
}
