import { supabase } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { deleteConsultationWithImages } from "./consultations";

type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];
type PetUpdate = Database["public"]["Tables"]["pets"]["Update"];
type Pet = Database["public"]["Tables"]["pets"]["Row"];
type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

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

export async function getNextRecordNumberByVet(vetId: string): Promise<number> {
  const { data, error } = await supabase
    .from("pets")
    .select("record_number")
    .eq("vet_id", vetId)
    .order("record_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  const highestRecordNumber = data?.record_number ?? 0;

  return highestRecordNumber + 1;
}

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

// ======== DELETE PET AND ALL RELATED DATA =========
export async function deletePetWithRelations(pet: Pet): Promise<void> {
  if (!pet?.pet_id) {
    throw new Error("No pet selected");
  }

  // 1) Get all consultations linked to this pet
  const { data: consultations, error: consultationsError } = await supabase
    .from("consultations")
    .select("*")
    .eq("pet_id", pet.pet_id);

  if (consultationsError) {
    console.error("Error fetching consultations for pet:", consultationsError);
    throw consultationsError;
  }

  const consultationsRows = (consultations ?? []) as ConsultationRow[];

  // 2) Delete each consultation with all its ultrasound images
  for (const consultation of consultationsRows) {
    await deleteConsultationWithImages(consultation.consultation_id);
  }

  // 3) Delete pet profile image from storage if it exists
  if (pet.image_path) {
    const { error: storageError } = await supabase.storage
      .from("pet-images")
      .remove([pet.image_path]);

    if (storageError) {
      console.error("Error deleting pet profile image:", storageError);
      throw storageError;
    }
  }

  // 4) Delete pet row from DB
  const { error: deletePetError } = await supabase
    .from("pets")
    .delete()
    .eq("pet_id", pet.pet_id);

  if (deletePetError) {
    console.error("Error deleting pet:", deletePetError);
    throw deletePetError;
  }
}
