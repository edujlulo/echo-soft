"use client";

import { useEffect, useRef, useCallback } from "react";
import { useConsultationFormStore } from "@/context/consultationFormStore";
import { updateConsultation } from "@/lib/queries/consultations";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];
type ConsultationUpdate = Partial<ConsultationRow>;

export function useConsultationForm() {
  const {
    selectedConsultation,
    setFieldConsultation,
    setSelectedConsultation,
    isSavingConsultation,
    setIsSavingConsultation,
    statusMessageConsultation,
    setStatusMessageConsultation,
    errorsConsultation,
    setErrorsConsultation,
  } = useConsultationFormStore();

  const pendingChanges = useRef<ConsultationUpdate>({});
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------
  // Set field con debounce
  // -------------------
  const handleFieldChange = useCallback(
    (field: keyof ConsultationRow, value: string | null) => {
      // Actualiza estado global de forma inmediata usando Zustand + Immer
      setFieldConsultation(field, value);

      // Acumula cambios pendientes
      pendingChanges.current = {
        ...pendingChanges.current,
        [field]: value,
      };

      // Reinicia debounce
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        saveConsultation();
      }, 2000);
    },
    [setFieldConsultation],
  );

  // -------------------
  // Guardar cambios en Supabase
  // -------------------
  const saveConsultation = useCallback(async () => {
    if (!selectedConsultation?.consultation_id) return;

    const changes = pendingChanges.current;
    if (Object.keys(changes).length === 0) return;

    setIsSavingConsultation(true);

    try {
      const updated: ConsultationRow = await updateConsultation(
        selectedConsultation.consultation_id,
        changes,
      );

      setSelectedConsultation(updated);
      pendingChanges.current = {};

      setStatusMessageConsultation("Guardado correctamente!");
      setTimeout(() => setStatusMessageConsultation(null), 1000);
    } catch (err: any) {
      console.error("Error guardando consulta:", err);
      setStatusMessageConsultation("Error guardando consulta");
      setTimeout(() => setStatusMessageConsultation(null), 2000);
    } finally {
      setIsSavingConsultation(false);
    }
  }, [
    selectedConsultation,
    setSelectedConsultation,
    setIsSavingConsultation,
    setStatusMessageConsultation,
  ]);

  // -------------------
  // Cleanup al desmontar
  // -------------------
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (Object.keys(pendingChanges.current).length > 0) saveConsultation();
    };
  }, [saveConsultation]);

  return {
    selectedConsultation,
    setFieldConsultation: handleFieldChange,
    isSavingConsultation,
    statusMessageConsultation,
    errorsConsultation,
    saveConsultation,
  };
}
