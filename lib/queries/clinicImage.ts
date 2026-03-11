import { supabase } from "../supabase/client";

// Traer la imagen de la clínica y generar signed URL
export async function getClinicImageWithSignedUrl(
  clinicId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("clinic_images")
    .select("*")
    .eq("clinic_id", clinicId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching clinic image:", error);
    return null;
  }

  if (!data?.file_path) return null;

  const { data: urlData, error: urlError } = await supabase.storage
    .from("clinic-images")
    .createSignedUrl(data.file_path, 3600);

  if (urlError) {
    console.error("Error creating signed URL:", urlError);
    return null;
  }

  return urlData.signedUrl;
}

// Subir imagen al bucket y registrar en la tabla
export async function uploadClinicImage(
  clinicId: string,
  file: File,
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `clinic.${fileExt}`;
  const filePath = `${clinicId}/${fileName}`;

  // Subir al bucket
  const { error: uploadError } = await supabase.storage
    .from("clinic-images")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Error uploading clinic image:", uploadError);
    return null;
  }

  // Revisar si ya existe imagen de la clínica
  const { data: existingImage } = await supabase
    .from("clinic_images")
    .select("*")
    .eq("clinic_id", clinicId)
    .maybeSingle();

  let dbError;

  if (existingImage) {
    // Actualizar fila existente
    const { error } = await supabase
      .from("clinic_images")
      .update({ file_path: filePath })
      .eq("id", existingImage.id);
    dbError = error;
  } else {
    // Insertar nueva fila
    const { error } = await supabase.from("clinic_images").insert([
      {
        clinic_id: clinicId,
        file_path: filePath,
      },
    ]);
    dbError = error;
  }

  if (dbError) {
    console.error("Error inserting/updating clinic_images table:", dbError);
    return null;
  }

  // Generar signed URL para frontend
  const { data: urlData, error: urlError } = await supabase.storage
    .from("clinic-images")
    .createSignedUrl(filePath, 3600);

  if (urlError) {
    console.error("Error creating signed URL:", urlError);
    return null;
  }

  return urlData.signedUrl;
}
