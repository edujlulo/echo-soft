"use client";

import Button from "@/components/Button";
import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

export default function EditableSelectList() {
  const { getTitle } = useEditableSelectListStore();

  // =========================
  // FILAS VACÍAS
  // =========================
  const rows: GridRowsProp = Array.from({ length: 20 }).map((_, index) => ({
    id: `empty-${index}`,
    frase: "",
  }));

  // =========================
  // COLUMNAS
  // =========================
  const columns: GridColDef[] = [
    {
      field: "frase",
      headerName: "Frase",
      flex: 1,
      editable: false, // cambiar a true si quieres permitir edición
      headerAlign: "center",
    },
  ];

  // =========================
  // RENDER
  // =========================
  return (
    <div className="px-4 py-4 bg-cyan-300 flex flex-col gap-2 justify-center items-center">
      <h1 className="w-full bg-white text-center text-xl text-blue-600 font-semibold">
        {getTitle()}
      </h1>
      <p className="w-full text-blue-800 text-start font-semibold">
        Haga doble click para seleccionar el valor
      </p>

      {/* ====== TABLE ====== */}
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 15, 20]}
          rowHeight={26}
          columnHeaderHeight={28}
          hideFooter
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
      </div>

      {/* ======== BUTTONS ======== */}
      <div className="flex flex-row gap-3 mt-4">
        <Button>Agregar</Button>
        <Button>Modificar</Button>
        <Button>Eliminar</Button>
      </div>
    </div>
  );
}
