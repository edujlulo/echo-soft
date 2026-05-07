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
type UltrasoundImageRow =
  Database["public"]["Tables"]["ultrasound_images"]["Row"];

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
  updates: ConsultationUpdate
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

// ============ AUTOSAVE CONSULTATION WITHOUT RETURNING ROW ============
export const autosaveConsultation = async (
  consultationId: string,
  updates: ConsultationUpdate
): Promise<void> => {
  const { error } = await supabase
    .from("consultations")
    .update(updates)
    .eq("consultation_id", consultationId);

  if (error) {
    console.error("Error autosaving consultation:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      updates,
      consultationId,
    });

    throw new Error(error.message);
  }
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

// =========== DELETE CONSULTATION AND RELATED IMAGES ===========
export const deleteConsultationWithImages = async (
  consultationId: string
): Promise<void> => {
  // 1) Get linked ultrasound images from DB
  const { data: images, error: imagesError } = await supabase
    .from("ultrasound_images")
    .select("*")
    .eq("consultation_id", consultationId)
    .is("deleted_at", null);

  if (imagesError) {
    console.error(
      "Error fetching ultrasound images for consultation:",
      imagesError
    );
    throw imagesError;
  }

  const ultrasoundImages = (images ?? []) as UltrasoundImageRow[];

  // 2) Remove files from Supabase Storage
  if (ultrasoundImages.length > 0) {
    const filesByBucket = ultrasoundImages.reduce<Record<string, string[]>>(
      (acc, image) => {
        const bucketName = image.bucket_name;
        const storagePath = image.storage_path;

        if (!bucketName || !storagePath) return acc;

        if (!acc[bucketName]) {
          acc[bucketName] = [];
        }

        acc[bucketName].push(storagePath);

        return acc;
      },
      {}
    );

    for (const [bucketName, paths] of Object.entries(filesByBucket)) {
      if (paths.length === 0) continue;

      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove(paths);

      if (storageError) {
        console.error(
          `Error deleting files from storage bucket "${bucketName}":`,
          storageError
        );
        throw storageError;
      }
    }

    // 3) Delete image rows from DB
    const imageIds = ultrasoundImages.map((image) => image.id);

    if (imageIds.length > 0) {
      const { error: deleteImagesError } = await supabase
        .from("ultrasound_images")
        .delete()
        .in("id", imageIds);

      if (deleteImagesError) {
        console.error(
          "Error deleting ultrasound image rows:",
          deleteImagesError
        );
        throw deleteImagesError;
      }
    }
  }

  // 4) Delete consultation row
  const { error: deleteConsultationError } = await supabase
    .from("consultations")
    .delete()
    .eq("consultation_id", consultationId);

  if (deleteConsultationError) {
    console.error("Error deleting consultation:", deleteConsultationError);
    throw deleteConsultationError;
  }
};
