"use client";

import {
  DataGrid,
  GridApi,
  GridColDef,
  GridRowSelectionModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import { usePetFetcher } from "@/hooks/usePetFetcher";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useRef, useEffect } from "react";

export default function PatientsTable() {
  const { pets, isLoading } = usePetFetcher();
  const { selectedPet, setSelectedPet } = useSelectedPetStore();

  // Mapeo de filas
  const rows = pets.map((pet) => ({
    id: pet.pet_id,
    record_number: pet.record_number,
    name: pet.name,
    owner: pet.owner,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    birth_date: pet.birth_date,
    diagnosis: pet.diagnosis,
  }));

  // Columnas
  const columns: GridColDef[] = [
    { field: "record_number", headerName: "Núm. Historia", flex: 1 },
    { field: "name", headerName: "Nombre Mascota", flex: 2 },
    { field: "owner", headerName: "Propietario", flex: 2.5 },
    { field: "species", headerName: "Especie", flex: 1 },
    { field: "breed", headerName: "Raza", flex: 1 },
    { field: "sex", headerName: "Sexo", flex: 1 },
    { field: "birth_date", headerName: "F. Nacimiento", flex: 1.2 },
    { field: "diagnosis", headerName: "Diagnóstico", flex: 2 },
  ];

  // 1️Crear ref del DataGrid
  const dataGridRef = useRef<HTMLDivElement>(null);

  // 1️Crear apiRef
  const apiRef = useGridApiRef();

  useEffect(() => {
    if (!selectedPet) return;

    // Espera un tick para que la fila se renderice
    const timeout = setTimeout(() => {
      const rowElement = document.querySelector(
        `[data-id="${selectedPet.pet_id}"]`,
      ) as HTMLDivElement | null;

      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50); // 50ms suele ser suficiente

    return () => clearTimeout(timeout);
  }, [selectedPet, rows]);

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        apiRef={apiRef}
        ref={dataGridRef}
        rows={rows}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[15]}
        rowHeight={26}
        columnHeaderHeight={28}
        hideFooter
        // Selecciona mascota con clic
        onRowClick={(params) => {
          const pet = pets.find((p) => p.pet_id === params.id);
          if (pet) setSelectedPet(pet);
        }}
        // Selecciona mascota con Enter o espacio
        onCellKeyDown={(params, event) => {
          if (event.key === "Enter" || event.key === " ") {
            const pet = pets.find((p) => p.pet_id === params.id);
            if (pet) setSelectedPet(pet);
            event.preventDefault();
          }
        }}
        getRowClassName={(params) =>
          selectedPet?.pet_id === params.id ? "selected-row" : ""
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
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid #93c5fd",
            borderBottom: "1px solid #93c5fd",
          },
          "& .MuiDataGrid-row": { borderBottom: "1px solid #93c5fd" },
          "& .Mui-selected": {
            backgroundColor: "#ffffff !important",
          },
          "& .selected-row": {
            backgroundColor: "#1e3a8a !important",
            color: "#f0f9ff",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "3px solid #1e3a8a",
            outlineOffset: -3,
          },
        }}
      />
    </div>
  );
}
