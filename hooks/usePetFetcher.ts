"use client";

import { useEffect, useState, useCallback } from "react";
import { getPetsByClinic } from "@/lib/queries/pets";
import { useClinicStore } from "@/context/activeClinicStore";
import { Database } from "@/types/database";
import { usePetsStore } from "@/context/petsStore";

type Pet = Database["public"]["Tables"]["pets"]["Row"];

export function usePetFetcher() {
  const { activeClinic } = useClinicStore();

  const { pets, setPets } = usePetsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    if (!activeClinic?.clinic_id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getPetsByClinic(activeClinic.clinic_id);
      setPets(data);
    } catch (err) {
      console.error(err);
      setError("Error loading pets");
    } finally {
      setIsLoading(false);
    }
  }, [activeClinic]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return {
    pets,
    isLoading,
    error,
    refreshPets: fetchPets,
  };
}
