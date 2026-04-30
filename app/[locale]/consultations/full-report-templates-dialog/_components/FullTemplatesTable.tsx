"use client";

import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Database } from "@/types/database";
import { useTranslations } from "next-intl";

type TextTemplateRow = Database["public"]["Tables"]["text_templates"]["Row"];

interface Props {
  templates: TextTemplateRow[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => Promise<void>;
  loading?: boolean;
}

export default function FullTemplatesTable({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  loading = false,
}: Props) {
  const t = useTranslations("FullReportTemplatesDialog");

  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: t("template"),
      flex: 1,
      sortable: false,
      filterable: false,
    },
  ];

  const filledRows = templates.map((template) => ({
    id: template.id,
    label: template.label ?? "",
    isEmpty: false,
  }));

  const emptyRowsCount = Math.max(0, 26 - filledRows.length);

  const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => ({
    id: `empty-${index}`,
    label: "",
    isEmpty: true,
  }));

  const rows = [...filledRows, ...emptyRows];

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
          if (params.row.isEmpty) return;
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
