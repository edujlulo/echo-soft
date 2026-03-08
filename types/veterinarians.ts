// veterinarians.ts

export type Veterinarian = {
  vet_id: string; // UUID
  clinic_id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null; //
  role: "vet" | "admin" | "staff"; // según tu aplicación
  created_at: string; // TIMESTAMP as string
  updated_at: string; // TIMESTAMP as string
  notes: Record<string, any> | null; // JSONB
  profile_photo: string | null; // URL o null
  signature: string | null; // URL o null
  registration_number: string | null;
};
