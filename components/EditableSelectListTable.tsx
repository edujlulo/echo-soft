"use client";

import { useConsultationStore } from "@/context/consultationStore";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Database } from "@/types/database";
import { useActiveVetStore } from "@/context/activeVetStore";
import { Pet } from "@/lib/queries/petImages";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];
type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

interface EditableSelectListProps {
  setFieldConsultation?: (
    field: keyof ConsultationRow,
    value: string | null,
  ) => void;
  selectedTemplate: TextTemplateRow | null;
  setSelectedTemplate: (template: TextTemplateRow | null) => void;
  initAddTemplate: (vet_id: string) => void;
  templates: TextTemplateRow[];
  loading: boolean;
  error: string | null;
  setField?: (field: keyof Pet, value: string) => void;
}

export default function EditableSelectListTable({
  setFieldConsultation,
  setField,
  selectedTemplate,
  setSelectedTemplate,
  templates,
  loading,
  error,
}: EditableSelectListProps) {
  const activeVet = useActiveVetStore((s) => s.activeVet);
  const activeCategory = useEditableSelectListStore((s) => s.activeCategory);

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
      sortable: true,
      sortComparator: (v1, v2) => {
        // Si v1 está vacío, se va al final
        if (!v1) return 1;
        // Si v2 está vacío, v1 va antes
        if (!v2) return -1;
        // Comparación normal alfabética
        return v1.localeCompare(v2);
      },
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

  // // ======== selectionModel ==========
  const selectionModel: GridRowSelectionModel = selectedTemplate
    ? {
        type: "include",
        ids: new Set([selectedTemplate.id]),
      }
    : {
        type: "include",
        ids: new Set(),
      };

  // // ============= Categories of Pet form ==============
  // const categoriesPetForm = ["owner", "referred_by", "sex", "breed"];

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
          rowSelectionModel={selectionModel}
          sortModel={[{ field: "frase", sort: "asc" }]}
          onRowClick={(params) => {
            // Ignorar filas vacías
            if (!params.row.id || params.row.id.toString().startsWith("empty-"))
              return;

            // Actualizar selectedTemplate con el template seleccionado
            const template = templates.find((t) => t.id === params.row.id);
            if (template) {
              setSelectedTemplate(template);
            }
          }}
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

            if (setField) {
              setField(activeCategory as any, newText.toUpperCase());
            } else if (setFieldConsultation) {
              // solo llamamos si existe
              setFieldConsultation(activeCategory as any, newText);
            }
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

            // foco visible para teclado
            // "& .MuiDataGrid-cell:focus": {
            //   outline: "1px solid #2563eb",
            //   backgroundColor: "#bfdbfe",
            // },
            // Estilo visual para la fila seleccionada
            "& .MuiDataGrid-row": {
              borderBottom: "1px solid #93c5fd",
              "&.Mui-selected, &.Mui-selected:hover": {
                backgroundColor: "#93c5fd",
              },
            },
          }}
        />
      </div>

      {error && <p className="text-red-600 font-bold">{error}</p>}
    </>
  );
}
