"use client";

import AppDialog from "@/components/AppDialog";
import Button from "@/components/Button";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import EditableSelectListTable from "./EditableSelectListTable";
import { Database } from "@/types/database";
import { useEffect, useState } from "react";
import EditableSelectListModal from "./EditableSelectListModal";
import { useActiveVetStore } from "@/context/activeVetStore";
import { useTemplateActions } from "@/hooks/useTemplateActions";
import { Pet } from "@/lib/queries/petImages";
import { useTranslations } from "next-intl";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface EditableSelectListProps {
  setFieldConsultation?: (
    field: keyof ConsultationRow,
    value: string | null
  ) => void;
  setField?: (field: keyof Pet, value: string) => void;
  buttonsClassName?: string;
}

export default function EditableSelectList({
  setFieldConsultation,
  setField,
  buttonsClassName,
}: EditableSelectListProps) {
  const t = useTranslations("EditableSelectList");
  const { getTitle, resetEditableSelectList } = useEditableSelectListStore();

  const {
    selectedTemplate,
    setSelectedTemplate,
    initAddTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    loading,
    error,
    templates,
    loading: templatesLoading,
    error: templatesError,
  } = useTemplateActions();

  // estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  // For vet_id
  const activeVet = useActiveVetStore((s) => s.activeVet);

  useEffect(() => {
    return () => {
      resetEditableSelectList();
    };
  }, [resetEditableSelectList]);

  // ========== RENDER ===========
  return (
    <div className="px-4 py-4 bg-cyan-300 flex flex-col gap-2 h-full overflow-hidden">
      <h1 className="w-full bg-white text-center text-xl text-blue-600 font-semibold">
        {getTitle() || t("defaultTitle")}
      </h1>
      <p className="w-full text-blue-800 text-start font-semibold">
        {t("doubleClickInstruction")}
      </p>

      {/* ====== TABLE ====== */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col h-full">
        <EditableSelectListTable
          setFieldConsultation={setFieldConsultation}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          initAddTemplate={initAddTemplate}
          templates={templates}
          loading={templatesLoading}
          error={templatesError}
          setField={setField}
        />
      </div>

      {/* ======== BUTTONS ======== */}
      <div
        className={`mt-4 flex flex-row gap-3 items-center justify-center ${buttonsClassName}`}
      >
        <Button
          onClick={() => {
            if (!activeVet) return;
            initAddTemplate(activeVet.vet_id); // inicializa template vacío con vet_id
            setIsModalOpen(true);
          }}
        >
          {t("add")}
        </Button>
        <Button
          onClick={() => {
            if (!selectedTemplate) {
              setIsWarningDialogOpen(true);
              return;
            }

            setIsModalOpen(true);
          }}
        >
          {t("edit")}
        </Button>
        <Button
          onClick={async () => {
            if (!selectedTemplate) {
              setIsWarningDialogOpen(true);
              return;
            }

            const success = await deleteTemplate();
            if (!success) return;
          }}
        >
          {t("delete")}
        </Button>
      </div>

      {/* ====== MODAL ====== */}
      <EditableSelectListModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        addTemplate={addTemplate}
        updateTemplate={updateTemplate}
      />

      <AppDialog
        isOpen={isWarningDialogOpen}
        onClose={() => setIsWarningDialogOpen(false)}
        navbarTitle={t("notice")}
        description={t("selectPhrase")}
        confirmLabel={t("accept")}
        onConfirm={() => setIsWarningDialogOpen(false)}
        showCancelButton={false}
        widthClassName="w-[420px]"
      />
    </div>
  );
}
