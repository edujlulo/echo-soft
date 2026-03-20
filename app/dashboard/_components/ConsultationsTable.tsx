"use client";

import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";

import { useSelectedPetStore } from "@/context/selectedPetStore";

import { useRef, useEffect, useMemo, useState } from "react";
import { useConsultations } from "@/hooks/useConsultations";
import { useSelectedConsultationStore } from "@/context/selectedConsultationStore";

export default function ConsultationsTable() {
  const { consultationsByPet, loadingConsultations } = useConsultations();
  const { selectedPet } = useSelectedPetStore();
  const { setSelectedConsultation } = useSelectedConsultationStore();

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const apiRef = useGridApiRef();
  const dataGridRef = useRef<HTMLDivElement>(null);

  // =========================
  // EMPTY ROWS
  // =========================

  const emptyRowCount = 7;

  const emptyRows = Array.from({ length: emptyRowCount }, (_, index) => ({
    id: `empty-${index}`,
    consultation_date: "",
    vet_name: "",
    report_title: "",
  }));

  // =========================
  // ROWS FROM DB
  // =========================

  const rows = useMemo(() => {
    const consultationRows =
      consultationsByPet?.map((c: any) => ({
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
    { field: "consultation_date", headerName: "Fecha", flex: 1 },
    { field: "vet_name", headerName: "Veterinario", flex: 2 },
    { field: "report_title", headerName: "Especialidad", flex: 2.5 },
  ];

  // =========================
  // RESET selection when pet changes
  // =========================

  useEffect(() => {
    setSelectedRowId(null);
    setSelectedConsultation(null);
  }, [selectedPet]);

  // =========================
  // SCROLL TO SELECTED
  // =========================

  useEffect(() => {
    if (!selectedRowId) return;

    const timeout = setTimeout(() => {
      const rowElement = document.querySelector(
        `[data-id="${selectedRowId}"]`,
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

  const handleRowClick = (params: any) => {
    if (String(params.id).startsWith("empty")) return;

    setSelectedRowId(params.id);

    const consultation = consultationsByPet?.find(
      (c: any) => c.consultation_id === params.id,
    );

    setSelectedConsultation(consultation ?? null);
  };

  // =========================
  // SELECT WITH ENTER / SPACE
  // =========================

  const handleKeyDown = (params: any, event: any) => {
    if (event.key === "Enter" || event.key === " ") {
      if (String(params.id).startsWith("empty")) return;

      setSelectedRowId(params.id);

      const consultation = consultationsByPet?.find(
        (c: any) => c.consultation_id === params.id,
      );

      setSelectedConsultation(consultation ?? null);

      event.preventDefault();
    }
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
