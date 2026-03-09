import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Veterinarian = Database["public"]["Tables"]["veterinarians"]["Row"];

// ========= GET ALL VETERINARIANS ==========
export async function getVeterinarians(): Promise<Veterinarian[]> {
  const { data, error } = await supabase.from("veterinarians").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// ========= GET VETERINARIAN BY ID ==========
export async function getVeterinarianById(id: string) {
  const { data, error } = await supabase
    .from("veterinarians")
    .select("*")
    .eq("vet_id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
