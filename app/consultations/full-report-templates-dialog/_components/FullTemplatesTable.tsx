"use client";

import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Database } from "@/types/database";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

interface Props {
  templates: TextTemplateRow[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  loading?: boolean;
}

export default function FullTemplatesTable({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  loading = false,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: "Template",
      flex: 1,
    },
  ];

  const rows = templates.map((template) => ({
    id: template.id,
    label: template.label ?? "",
  }));

  const rowSelectionModel: GridRowSelectionModel = {
    type: "include",
    ids: new Set(selectedTemplateId ? [selectedTemplateId] : []),
  };

  return (
    <div className="h-full w-[38%] min-w-0">
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        rowHeight={26}
        columnHeaderHeight={28}
        checkboxSelection={false}
        loading={loading}
        rowSelectionModel={rowSelectionModel}
        onRowClick={(params) => {
          onSelectTemplate(String(params.id));
        }}
        sx={{
          width: "100%",
          height: "100%",
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
            cursor: "pointer",
          },

          "& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover":
            {
              backgroundColor: "#93c5fd",
            },
        }}
      />
    </div>
  );
}
