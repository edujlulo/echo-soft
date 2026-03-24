"use client";

import Button from "@/components/Button";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import EditableSelectListTable from "./EditableSelectListTable";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface EditableSelectListProps {
  setFieldConsultation: (
    field: keyof ConsultationRow,
    value: string | null,
  ) => void;
}

export default function EditableSelectList({
  setFieldConsultation,
}: EditableSelectListProps) {
  const { getTitle } = useEditableSelectListStore();

  // ========== RENDER ===========
  return (
    <div className="px-4 py-4 bg-cyan-300 flex flex-col gap-2 justify-center items-center">
      <h1 className="w-full bg-white text-center text-xl text-blue-600 font-semibold">
        {getTitle()}
      </h1>
      <p className="w-full text-blue-800 text-start font-semibold">
        Haga doble click para seleccionar el valor
      </p>

      {/* ====== TABLE ====== */}
      <EditableSelectListTable setFieldConsultation={setFieldConsultation} />

      {/* ======== BUTTONS ======== */}
      <div className="flex flex-row gap-3 mt-4">
        <Button>Agregar</Button>
        <Button>Modificar</Button>
        <Button>Eliminar</Button>
      </div>
    </div>
  );
}
