import { Database } from "@/types/database";
import { supabase } from "../supabase/client";

interface NewConsultation {
  pet_id: string;
  vet_id: string;
  clinic_id: string;
  consultation_date: string;
  vet_name: string;
  report_title: string;
}

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];
type ConsultationUpdate = Partial<ConsultationRow>;

// ============ INSERT NEW CONSULTATION ============
export const insertConsultation = async (consultation: NewConsultation) => {
  const { data, error } = await supabase
    .from("consultations")
    .insert([consultation])
    .select();

  if (error) {
    console.error("Error inserting consultation:", error);
    return null;
  }

  return data ? data[0] : null;
};

// ============ UPDATE CONSULTATION ============
export const updateConsultation = async (
  consultationId: string,
  updates: ConsultationUpdate,
): Promise<ConsultationRow> => {
  const { data, error } = await supabase
    .from("consultations")
    .update(updates)
    .eq("consultation_id", consultationId)
    .select()
    .single(); // devuelve solo un objeto

  if (error) {
    console.error("Error updating consultation:", error);
    throw error;
  }

  return data;
};

// =========== GET CONSULTATIONS BY PET ID ===========
export const getConsultationsByPetId = async (petId: string) => {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("pet_id", petId)
    .order("consultation_date", { ascending: false });

  if (error) {
    console.error("Error fetching consultations:", error);
    return [];
  }

  return data ?? [];
};
