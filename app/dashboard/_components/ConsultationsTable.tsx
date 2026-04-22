"use client";

import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";

import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useConsultationStore } from "@/context/consultationStore";

import { useRef, useEffect, useMemo, useState } from "react";

import { Database } from "@/types/database";
import { useRouter } from "next/navigation";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface Props {
  consultationsByPet: ConsultationRow[];
  loadingConsultations: boolean;
}

export default function ConsultationsTable({
  consultationsByPet,
  loadingConsultations,
}: Props) {
  const router = useRouter();

  const selectedPet = useSelectedPetStore((s) => s.selectedPet);

  const { selectedConsultation, setSelectedConsultation, loadFromSelected } =
    useConsultationStore();

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const apiRef = useGridApiRef();
  const dataGridRef = useRef<HTMLDivElement>(null);

  const navigateToConsultations = () => {
    router.push("/consultations");
  };

  // =========================
  // EMPTY ROWS
  // =========================

  const emptyRowCount = 7;

  // =========================
  // ROWS FROM DB
  // =========================

  const rows = useMemo(() => {
    const consultationRows =
      consultationsByPet?.map((c: ConsultationRow) => ({
        id: c.consultation_id,
        consultation_date: c.consultation_date?.slice(0, 10),
        vet_name: c.vet_name,
        report_title: c.report_title,
      })) ?? [];

    const missingRows = Math.max(0, emptyRowCount - consultationRows.length);

    const extraEmptyRows = Array.from({ length: missingRows }, (_, index) => ({
      id: `empty-${index}`,
      consultation_date: "",
      vet_name: "",
      report_title: "",
    }));

    return [...consultationRows, ...extraEmptyRows];
  }, [consultationsByPet]);

  // =========================
  // COLUMNS
  // =========================

  const columns: GridColDef[] = [
    {
      field: "consultation_date",
      headerName: "Fecha",
      flex: 1,
      renderCell: (params) => {
        if (!params.value) return "";

        const date = new Date(params.value);

        if (isNaN(date.getTime())) return "";

        return date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "vet_name",
      headerName: "Veterinario",
      flex: 2,
    },
    {
      field: "report_title",
      headerName: "Especialidad",
      flex: 2.5,
    },
  ];

  // =========================
  // RESET when pet changes
  // =========================

  useEffect(() => {
    setSelectedRowId(null);
    setSelectedConsultation(null);
    loadFromSelected(null);
  }, [selectedPet]);

  // =========================
  // SCROLL TO SELECTED
  // =========================

  useEffect(() => {
    if (!selectedRowId) return;

    const timeout = setTimeout(() => {
      const rowElement = document.querySelector(
        `[data-id="${selectedRowId}"]`
      ) as HTMLDivElement | null;

      if (rowElement) {
        rowElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [selectedRowId, rows]);

  // =========================
  // SELECT WITH CLICK
  // =========================

  const selectConsultation = (id: string) => {
    const consultation =
      consultationsByPet?.find(
        (c: ConsultationRow) => c.consultation_id === id
      ) ?? null;

    setSelectedRowId(id);
    setSelectedConsultation(consultation);
    loadFromSelected(consultation);
  };

  const handleRowClick = (params: any) => {
    if (String(params.id).startsWith("empty")) return;

    selectConsultation(params.id);
  };

  // =========================
  // SELECT WITH ENTER / SPACE
  // =========================

  const handleKeyDown = (params: any, event: any) => {
    if (event.key === "Enter" || event.key === " ") {
      if (String(params.id).startsWith("empty")) return;

      selectConsultation(params.id);

      event.preventDefault();
    }
  };

  // =========================
  // OPEN PAGE ON DOUBLE CLICK
  // =========================

  const handleRowDoubleClick = (params: any) => {
    if (String(params.id).startsWith("empty")) return;

    // Set selected consultation
    selectConsultation(params.id);

    // Navigate to /consultations
    navigateToConsultations();
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div style={{ height: 185, width: "100%" }}>
      <DataGrid
        apiRef={apiRef}
        ref={dataGridRef}
        rows={rows}
        columns={columns}
        loading={loadingConsultations}
        pageSizeOptions={[15]}
        rowHeight={26}
        columnHeaderHeight={28}
        hideFooter
        onRowClick={handleRowClick}
        onRowDoubleClick={handleRowDoubleClick}
        onCellKeyDown={handleKeyDown}
        getRowClassName={(params) =>
          selectedRowId === params.id ? "selected-row" : ""
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

          "& .Mui-selected": {
            backgroundColor: "#ffffff !important",
          },

          "& .selected-row": {
            backgroundColor: "#1e3a8a !important",
            color: "#f0f9ff",
          },

          "& .MuiDataGrid-cell:focus": {
            outline: "3px solid #1e3a8a",
          },
        }}
      />
    </div>
  );
}
