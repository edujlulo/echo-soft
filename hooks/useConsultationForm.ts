"use client";

import { useEffect, useRef } from "react";
import { updateConsultation } from "@/lib/queries/consultations";
import { Database } from "@/types/database";
import { useConsultationStore } from "@/context/consultationStore";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];
type ConsultationUpdate = Partial<ConsultationRow>;

/**
 * Hook para manejar la edición de consulta con debounce, sin usar useCallback para saveConsultation
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

  // -------------------
  // Refs para debounce y cambios
  // -------------------
  const pendingChanges = useRef<ConsultationUpdate>({});
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef(formConsultation);

  // Mantener formRef actualizado con la última versión
  useEffect(() => {
    formRef.current = formConsultation;
  }, [formConsultation]);

  // -------------------
  // Guardar cambios en Supabase
  // -------------------
  const saveConsultation = async () => {
    const consultation = formRef.current;
    if (!consultation?.consultation_id) return;

    const changes = pendingChanges.current;
    if (Object.keys(changes).length === 0) return;

    setIsSavingConsultation(true);

    try {
      const updated = await updateConsultation(
        consultation.consultation_id,
        changes,
      );

      loadFromSelected(updated);
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
  };

  // -------------------
  // Cambios en campos con debounce
  // -------------------
  const handleFieldChange = (
    field: keyof ConsultationRow,
    value: string | null,
  ) => {
    const normalizedValue = value === "" ? null : value;

    // Actualiza la copia editable inmediatamente
    setFieldConsultation(field, normalizedValue);

    // Acumula cambios pendientes
    pendingChanges.current = {
      ...pendingChanges.current,
      [field]: normalizedValue,
    };

    // Reinicia debounce
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveConsultation();
    }, 2000);
  };

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
  }, []);

  return {
    formConsultation,
    selectedConsultation,
    setFieldConsultation: handleFieldChange,
    isSavingConsultation,
    statusMessageConsultation,
    saveConsultation,
  };
}
