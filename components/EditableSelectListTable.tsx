"use client";

import { useConsultationStore } from "@/context/consultationStore";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { useEditableSelectList } from "@/hooks/useEditableSelectList";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface EditableSelectListProps {
  setFieldConsultation: (
    field: keyof ConsultationRow,
    value: string | null,
  ) => void;
}

export default function EditableSelectListTable({
  setFieldConsultation,
}: EditableSelectListProps) {
  const { templates, loading, error } = useEditableSelectList();

  const activeCategory = useEditableSelectListStore((s) => s.activeCategory);

  // const setFieldConsultation = useConsultationStore(
  //   (s) => s.setFieldConsultation,
  // );

  // const { setFieldConsultation } = useConsultationForm();

  const formConsultation = useConsultationStore((s) => s.formConsultation);

  // =========================
  // FILAS
  // =========================
  const rows: GridRowsProp = [
    ...templates.map((t) => ({ id: t.id, frase: t.content })),
    ...Array.from({ length: Math.max(0, 20 - templates.length) }).map(
      (_, i) => ({
        id: `empty-${i}`,
        frase: "",
      }),
    ),
  ];

  // =========================
  // COLUMNAS
  // =========================
  const columns: GridColDef[] = [
    {
      field: "frase",
      headerName: "Frase",
      flex: 1,
      editable: false,
      headerAlign: "center",
    },
  ];

  // =========================
  // HELPER FUNCTION FOR PHRASES TOGGLE
  // =========================
  function togglePhraseWithInvisibleSeparator(
    currentText: string,
    phrase: string,
  ): string {
    const SEP = "\u{241F}";

    // Reemplazamos para separar las frases existentes por el separador
    const phrases = currentText ? currentText.split(SEP) : [];

    const index = phrases.indexOf(phrase);

    if (index !== -1) {
      // Si ya existe, eliminar
      phrases.splice(index, 1);
    } else {
      // Si no existe, agregar al final
      phrases.push(phrase);
    }

    // Reconstruir con separador invisible
    return phrases.join(SEP);
  }

  return (
    <>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          hideFooter
          rowHeight={26}
          columnHeaderHeight={28}
          // ✅ importante para teclado
          disableRowSelectionOnClick
          checkboxSelection={false}
          onRowDoubleClick={(params) => {
            if (!activeCategory) return;

            const currentText =
              formConsultation?.[
                activeCategory as keyof typeof formConsultation
              ] ?? "";
            const newText = togglePhraseWithInvisibleSeparator(
              currentText,
              params.row.frase,
            );

            setFieldConsultation(activeCategory as any, newText);
          }}
          sx={{
            border: "1px solid #93c5fd",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#dbeafe",
              color: "#172554",
            },

            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#dbeafe",
              color: "#172554",
              borderRight: "1px solid #93c5fd",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },

            "& .MuiDataGrid-cell": {
              borderRight: "1px solid #93c5fd",
              borderBottom: "1px solid #93c5fd",
            },

            "& .MuiDataGrid-row": {
              borderBottom: "1px solid #93c5fd",
            },

            // foco visible para teclado
            "& .MuiDataGrid-cell:focus": {
              outline: "1px solid #2563eb",
              backgroundColor: "#bfdbfe",
            },
          }}
        />
      </div>

      {error && <p className="text-red-600 font-bold">{error}</p>}
    </>
  );
}
