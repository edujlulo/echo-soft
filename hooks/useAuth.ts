"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useClinicStore } from "@/context/activeClinicStore";
import { useActiveVetStore } from "@/context/activeVetStore";
import { Database } from "@/types/database";

export function useAuth() {
  const router = useRouter();
  const setActiveClinic = useClinicStore((state) => state.setActiveClinic);
  const setActiveVet = useActiveVetStore((state) => state.setActiveVet);

  type Vet = Database["public"]["Tables"]["veterinarians"]["Row"];

  const login = async (email: string, password: string) => {
    // 1️⃣ Login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error("Correo o contraseña incorrectos");

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new Error("No se pudo obtener la sesión");
    }

    const user = data.user;

    // 2️⃣ Buscar al veterinario
    const { data: vet, error: vetError } = await supabase
      .from("veterinarians")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (vetError || !vet) throw new Error("Veterinario no encontrado");

    // Validar que vet tenga clinic_id
    if (!vet.clinic_id) throw new Error("El veterinario no tiene clinic_id");

    setActiveVet({
      ...vet,
      name: `${vet.name}`,
      registration_number: vet.registration_number ?? null,
    });

    // 3️⃣ Obtener la clínica
    const { data: clinic, error: clinicError } = await supabase
      .from("clinics")
      .select("*")
      .eq("clinic_id", vet.clinic_id) // ahora seguro
      .single();

    if (clinicError || !clinic) throw new Error("Clínica no encontrada");

    // 4️⃣ Guardar en Zustand
    const normalizedClinic = {
      id: clinic.clinic_id!, // obligatorio
      clinic_id: clinic.clinic_id!, // obligatorio
      name: clinic.name!, // obligatorio
      email: clinic.email || undefined,
      address: clinic.address || undefined,
      city: clinic.city || undefined,
      state: clinic.state || undefined,
      zip_code: clinic.zip_code || undefined,
      phone: clinic.phone || undefined,
      notes: clinic.notes || undefined,
      created_at: clinic.created_at || undefined,
      updated_at: clinic.updated_at || undefined,
    };

    setActiveClinic(normalizedClinic);

    // 5️⃣ Redirigir
    router.replace("/home");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return {
    login,
    logout,
  };
}
