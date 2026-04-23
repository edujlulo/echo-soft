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
import { useRef, useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";

type PetRow = {
  id: string;
  record_number: number;
  name: string;
  owner: string;
  species: string | null;
  breed: string | null;
  sex: string | null;
  birth_date: string | null;
};

type ColumnFilters = {
  record_number: string;
  name: string;
  owner: string;
  species: string;
  breed: string;
  sex: string;
};

export default function PatientsTable() {
  const { pets, isLoading } = usePetFetcher();
  const { startEditing, selectedPet, setSelectedPet } = useSelectedPetStore();

  const [filters, setFilters] = useState<ColumnFilters>({
    record_number: "",
    name: "",
    owner: "",
    species: "",
    breed: "",
    sex: "",
  });

  const handleFilterChange = (field: keyof ColumnFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const normalizeValue = (value: string | number | null | undefined) => {
    return String(value ?? "")
      .toLowerCase()
      .trim();
  };

  // Mapeo de filas
  const baseRows = useMemo(
    () =>
      pets.map((pet) => ({
        id: pet.pet_id,
        record_number: pet.record_number,
        name: pet.name,
        owner: pet.owner,
        species: pet.species,
        breed: pet.breed,
        sex: pet.sex,
        birth_date: pet.birth_date,
      })),
    [pets],
  );

  const filteredRows = useMemo(() => {
    return baseRows.filter((row) => {
      return (
        normalizeValue(row.record_number).includes(
          normalizeValue(filters.record_number),
        ) &&
        normalizeValue(row.name).includes(normalizeValue(filters.name)) &&
        normalizeValue(row.owner).includes(normalizeValue(filters.owner)) &&
        normalizeValue(row.species).includes(normalizeValue(filters.species)) &&
        normalizeValue(row.breed).includes(normalizeValue(filters.breed)) &&
        normalizeValue(row.sex).includes(normalizeValue(filters.sex))
      );
    });
  }, [baseRows, filters]);

  // Columnas
  const columns: GridColDef<PetRow>[] = [
    { field: "record_number", headerName: "Núm. Historia", flex: 0.8 },
    { field: "name", headerName: "Nombre Mascota", flex: 1.7 },
    { field: "owner", headerName: "Propietario", flex: 2.5 },
    { field: "species", headerName: "Especie", flex: 1 },
    { field: "breed", headerName: "Raza", flex: 1.2 },
    { field: "sex", headerName: "Sexo", flex: 1.2 },
    {
      field: "birth_date",
      headerName: "F. Nacimiento",
      flex: 1,
      renderCell: (params) => {
        if (!params.value) return "";

        const date = new Date(params.value);

        if (isNaN(date.getTime())) return "";

        return date.toLocaleDateString("en-GB");
      },
    },
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
  }, [selectedPet, filteredRows]);

  // Rellenar con filas vacías hasta 15 filas
  const totalRows = 15;
  const emptyRowsCount = Math.max(totalRows - filteredRows.length, 0);

  const emptyRows: PetRow[] = Array.from(
    { length: emptyRowsCount },
    (_, i) => ({
      id: `empty-${i}`, // ID único para cada fila vacía
      record_number: 0,
      name: "",
      owner: "",
      species: null,
      breed: null,
      sex: null,
      birth_date: null,
    }),
  );

  // Combinar filas reales + vacías
  const displayRows = [...filteredRows, ...emptyRows];

  // =========================
  // OPEN PAGE ON DOUBLE CLICK
  // =========================

  const handleRowDoubleClick = (params: any) => {
    if (String(params.id).startsWith("empty")) return;

    // Asegurarse de que la fila está seleccionada
    const pet = pets.find((p) => p.pet_id === params.id);
    if (pet) setSelectedPet(pet);

    // Navegar o abrir modal
    startEditing();
  };

  const inputsClassName =
    "min-w-0 bg-white px-2 text-sm outline-none border border-blue-300 pt-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500";

  return (
    <div className="w-full">
      <div className="mb-1 grid grid-cols-[0.8fr_1.7fr_2.5fr_1fr_1.2fr_1.2fr_1.15fr] gap-x-[5px]">
        <input
          type="text"
          value={filters.record_number}
          onChange={(e) => handleFilterChange("record_number", e.target.value)}
          placeholder="Buscar..."
          className={inputsClassName}
        />

        <input
          type="text"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          placeholder="Buscar..."
          className={inputsClassName}
        />

        <input
          type="text"
          value={filters.owner}
          onChange={(e) => handleFilterChange("owner", e.target.value)}
          placeholder="Buscar..."
          className={inputsClassName}
        />

        <input
          type="text"
          value={filters.species}
          onChange={(e) => handleFilterChange("species", e.target.value)}
          placeholder="Buscar..."
          className={inputsClassName}
        />

        <input
          type="text"
          value={filters.breed}
          onChange={(e) => handleFilterChange("breed", e.target.value)}
          placeholder="Buscar..."
          className={inputsClassName}
        />

        <input
          type="text"
          value={filters.sex}
          onChange={(e) => handleFilterChange("sex", e.target.value)}
          placeholder="Buscar..."
          className={inputsClassName}
        />

        <div className="ml-2">
          <Button
            type="button"
            onClick={() =>
              setFilters({
                record_number: "",
                name: "",
                owner: "",
                species: "",
                breed: "",
                sex: "",
              })
            }
          >
            Mostrar todos
          </Button>
        </div>
      </div>

      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          ref={dataGridRef}
          rows={displayRows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[15]}
          rowHeight={26}
          columnHeaderHeight={28}
          hideFooter
          onRowDoubleClick={handleRowDoubleClick}
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
    </div>
  );
}
