// hooks/useVeterinarians.ts
"use client";

import { useEffect, useState } from "react";
import { useClinicStore } from "@/context/activeClinicStore";
import { getVeterinarians as fetchVeterinarians } from "@/lib/queries/veterinarians";
import { Database } from "@/types/database";

// Tipo de fila tal como la devuelve Supabase
type VeterinarianRow = Database["public"]["Tables"]["veterinarians"]["Row"];

// Tipo que tu UI espera
export interface Vet {
  vet_id: string;
  name: string;
  registration_number?: string;
}

export function useVeterinarians() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const activeClinic = useClinicStore((state) => state.activeClinic);

  useEffect(() => {
    if (!activeClinic) return;

    const fetchVets = async () => {
      setLoading(true);
      try {
        // Traemos los datos de la clínica activa
        const data: VeterinarianRow[] = await fetchVeterinarians(
          activeClinic.clinic_id,
        );

        // <-- Aquí entra tu fragmento: transformamos los datos a lo que necesita la UI
        const formatted: Vet[] = data.map((vet: VeterinarianRow) => ({
          vet_id: vet.vet_id,
          name: `${vet.first_name} ${vet.last_name}`, // concatenamos nombres
          registration_number: vet.registration_number || "",
        }));

        setVets(formatted);
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
        setVets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVets();
  }, [activeClinic]);

  return { vets, loading };
}
