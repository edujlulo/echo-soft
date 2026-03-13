import { supabase } from "@/lib/supabase/client";
import { Database } from "@/types/database";

type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];
type PetUpdate = Database["public"]["Tables"]["pets"]["Update"];
type Pet = Database["public"]["Tables"]["pets"]["Row"];

// ======= INSERT PET TO DATA BASE =========
export const addPetQuery = async (pet: PetInsert) => {
  const { data, error } = await supabase
    .from("pets")
    .insert([pet])
    .select()
    .single();

  if (error) throw error;
  return data; // retorna el registro insertado
};

// ======== UPDATE PET ==========
export async function updatePet(petId: string, data: PetUpdate) {
  const { data: updated, error } = await supabase
    .from("pets")
    .update(data)
    .eq("pet_id", petId)
    .select()
    .single();

  if (error) throw error;

  return updated;
}

// ======== GET PETS BY CLINIC =========
export async function getPetsByClinic(clinicId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("clinic_id", clinicId)
    .order("name");

  if (error) {
    throw error;
  }

  return data ?? [];
}
