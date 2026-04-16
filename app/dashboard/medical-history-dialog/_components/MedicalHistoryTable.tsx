"use client";

import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Database } from "@/types/database";

export default function MedicalHistoryTable() {
  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: "Veterinario",
      flex: 1,
      sortable: false,
      filterable: false,
    },
  ];

  const emptyRowsCount = Math.max(0, 26);

  const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => ({
    id: `empty-${index}`,
    label: "",
    isEmpty: true,
  }));

  const rows = [...emptyRows];

  return (
    <div className="h-full w-full min-h-0 min-w-0 overflow-hidden">
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        rowHeight={26}
        columnHeaderHeight={28}
        checkboxSelection={false}
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
