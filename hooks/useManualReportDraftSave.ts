"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConsultationStore } from "@/context/consultationStore";
import { updateConsultation } from "@/lib/queries/consultations";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

export function useManualReportDraftSave() {
  const selectedConsultation = useConsultationStore(
    (state) => state.selectedConsultation,
  );
  const manualReportDraft = useConsultationStore(
    (state) => state.manualReportDraft,
  );
  const reportMode = useConsultationStore((state) => state.reportMode);

  const setSelectedConsultation = useConsultationStore(
    (state) => state.setSelectedConsultation,
  );
  const setStatusMessageConsultation = useConsultationStore(
    (state) => state.setStatusMessageConsultation,
  );

  const [isSavingManualReportDraft, setIsSavingManualReportDraft] =
    useState(false);

  const consultationIdRef = useRef<string | null>(null);
  const latestDraftRef = useRef("");
  const lastSavedDraftRef = useRef("");
  const latestModeRef = useRef<"organs" | "full-template">("organs");

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const queuedSaveRef = useRef(false);

  useEffect(() => {
    consultationIdRef.current = selectedConsultation?.consultation_id ?? null;
  }, [selectedConsultation?.consultation_id]);

  useEffect(() => {
    latestDraftRef.current = manualReportDraft;
  }, [manualReportDraft]);

  useEffect(() => {
    latestModeRef.current = reportMode;
  }, [reportMode]);

  useEffect(() => {
    lastSavedDraftRef.current = selectedConsultation?.manual_report_draft ?? "";
  }, [selectedConsultation?.manual_report_draft]);

  const saveManualReportDraftNow = useCallback(async (): Promise<void> => {
    const consultationId = consultationIdRef.current;
    const currentDraft = latestDraftRef.current;
    const currentMode = latestModeRef.current;
    const lastSavedDraft = lastSavedDraftRef.current;

    if (!consultationId) return;
    if (currentMode !== "full-template") return;
    if (currentDraft === lastSavedDraft) return;

    if (isSavingRef.current) {
      queuedSaveRef.current = true;
      return;
    }

    isSavingRef.current = true;
    queuedSaveRef.current = false;
    setIsSavingManualReportDraft(true);

    const draftSnapshot = currentDraft;

    try {
      const updated = await updateConsultation(consultationId, {
        manual_report_draft: draftSnapshot,
        report_mode: "full-template",
      });

      setSelectedConsultation(updated);

      if (latestDraftRef.current === draftSnapshot) {
        lastSavedDraftRef.current = draftSnapshot;
      } else {
        queuedSaveRef.current = true;
      }

      setStatusMessageConsultation("Guardado correctamente!");
      setTimeout(() => setStatusMessageConsultation(null), 1000);
    } catch (err: any) {
      console.error("Error saving manual report draft:", err);
      queuedSaveRef.current = true;
      setStatusMessageConsultation("Error guardando consulta");
      setTimeout(() => setStatusMessageConsultation(null), 2000);
    } finally {
      isSavingRef.current = false;
      setIsSavingManualReportDraft(false);

      if (queuedSaveRef.current) {
        queuedSaveRef.current = false;
        void saveManualReportDraftNow();
      }
    }
  }, [setSelectedConsultation, setStatusMessageConsultation]);

  useEffect(() => {
    if (!selectedConsultation?.consultation_id) return;
    if (reportMode !== "full-template") return;
    if (manualReportDraft === lastSavedDraftRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveManualReportDraftNow();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [manualReportDraft, reportMode, selectedConsultation?.consultation_id]);

  const flushManualReportDraftSave = useCallback(async (): Promise<void> => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    await saveManualReportDraftNow();
  }, [saveManualReportDraftNow]);

  return {
    isSavingManualReportDraft,
    flushManualReportDraftSave,
  };
}
