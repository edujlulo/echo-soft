"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function OrgansTable() {
  const columns: GridColDef[] = [
    {
      field: "organ",
      headerName: "ORGANO",
      flex: 1,
    },
  ];

  const organList = [
    "MOTIVOS",
    "EQUIPOS",
    "VEJIGA URINARIA",
    "BAZO",
    "PÁNCREAS",
    "RIÑÓN IZQUIERDO",
    "HÍGADO",
    "ÚTERO",
    "RIÑÓN DERECHO",
    "VESÍCULA BILIAR",
    "ESTÓMAGO",
    "INTESTINO DELGADO",
    "INTESTINO GRUESO",
    "URETRA",
    "LINFONODOS",
    "GLÁNDULAS ADRENALES",
    "PRÓSTATA",
    "TESTÍCULOS",
    "OVARIOS",
    "GLÁNDULA TIROIDES",
    "GLÁNDULA MAMARIA",
    "OCULAR",
    "MUSCULAR",
    "HUESOS",
    "TÓRAX, PULMONES",
    "OTROS",
    "GRANDES VASOS, VENAS Y ARTERIAS",
    "CAVIDAD ABDOMINAL",
    "CONCLUSIONES",
    "OBSERVACIONES",
  ];

  const rows = organList.map((organ, index) => ({
    id: index + 1,
    organ,
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
      }}
    />
  );
}
