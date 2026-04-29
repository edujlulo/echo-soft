"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { consultationCategories } from "@/config/consultationCategories";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";

export default function OrgansTable() {
  const setActiveCategory = useEditableSelectListStore(
    (state) => state.setActiveCategory
  );

  const setActiveField = useEditableSelectListStore(
    (state) => state.setActiveField
  );

  const activeCategory = useEditableSelectListStore(
    (state) => state.activeCategory
  );

  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: "ORGANO",
      flex: 1,
    },
  ];

  const rows = consultationCategories.map((c, index) => ({
    id: index + 1,
    label: c.label,
    key: c.key,
  }));

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      hideFooter
      rowHeight={26}
      columnHeaderHeight={28}
      disableRowSelectionOnClick
      checkboxSelection={false}
      onRowClick={(params) => {
        setActiveCategory(params.row.key);
        setActiveField(params.row.label);
      }}
      getRowClassName={(params) =>
        params.row.key === activeCategory ? "selected-row" : ""
      }
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

        "& .MuiDataGrid-row.selected-row, & .MuiDataGrid-row.selected-row:hover":
          {
            backgroundColor: "#93c5fd",
          },
      }}
    />
  );
}
