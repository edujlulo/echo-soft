import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Veterinarian = Database["public"]["Tables"]["veterinarians"]["Row"];

export async function getVeterinarians(
  clinicId: string,
): Promise<Veterinarian[]> {
  const { data, error } = await supabase
    .from("veterinarians")
    .select("*")
    .eq("clinic_id", clinicId); // filtramos por clínica

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
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
