export interface Clinic {
  clinic_id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
  notes: Record<string, any>;
}
