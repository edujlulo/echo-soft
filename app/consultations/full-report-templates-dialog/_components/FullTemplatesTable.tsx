"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function FullTemplatesTable() {
  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: "Plantilla",
      flex: 1,
    },
  ];

  // EMPTY ROWS:
  const EMPTY_ROW_COUNT = 40;

  const rows = Array.from({ length: EMPTY_ROW_COUNT }, (_, index) => ({
    id: index + 1,
    label: "",
  }));

  return (
    <div className="h-full w-[38%] min-w-0">
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        rowHeight={26}
        columnHeaderHeight={28}
        disableRowSelectionOnClick
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
          },

          "& .MuiDataGrid-row.selected-row, & .MuiDataGrid-row.selected-row:hover":
            {
              backgroundColor: "#93c5fd",
            },
        }}
      />
    </div>
  );
}
