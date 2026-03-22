"use client";

import { useCallback, useEffect, useRef } from "react";
import { updateConsultation } from "@/lib/queries/consultations";
import { Database } from "@/types/database";
import { useConsultationStore } from "@/context/consultationStore";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];
type ConsultationUpdate = Partial<ConsultationRow>;

/**
 * Custom hook para manejar la consulta editable con debounce
 * y sincronización con la fuente de verdad.
 */
export function useConsultationForm() {
  const {
    formConsultation,
    selectedConsultation,
    setFieldConsultation,
    loadFromSelected,
    setSelectedConsultation,
    isSavingConsultation,
    setIsSavingConsultation,
    statusMessageConsultation,
    setStatusMessageConsultation,
  } = useConsultationStore();

  // Cambios pendientes antes de guardado
  const pendingChanges = useRef<ConsultationUpdate>({});
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------
  // Cambios en campos con debounce
  // -------------------
  const handleFieldChange = useCallback(
    (field: keyof ConsultationRow, value: string | null) => {
      // Actualiza la copia editable inmediatamente
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
    [setFieldConsultation]
  );

  // -------------------
  // Guardar cambios en Supabase
  // -------------------
  const saveConsultation = useCallback(async () => {
    if (!formConsultation?.consultation_id) return;
    const changes = pendingChanges.current;
    if (Object.keys(changes).length === 0) return;

    setIsSavingConsultation(true);

    try {
      const updated: ConsultationRow = await updateConsultation(
        formConsultation.consultation_id,
        changes
      );

      // Actualiza la copia editable
      loadFromSelected(updated);

      // Actualiza la fuente de verdad
      setSelectedConsultation(updated);

      // Resetea cambios pendientes
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
    formConsultation,
    loadFromSelected,
    setSelectedConsultation,
    setIsSavingConsultation,
    setStatusMessageConsultation,
  ]);

  // -------------------
  // Sincronizar copia editable con la selección global
  // -------------------
  useEffect(() => {
    loadFromSelected(selectedConsultation);
    pendingChanges.current = {};
  }, [selectedConsultation, loadFromSelected]);

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
    formConsultation,
    selectedConsultation,
    setFieldConsultation: handleFieldChange,
    isSavingConsultation,
    statusMessageConsultation,
    saveConsultation,
  };
}
