"use client";

import AppDialog from "@/components/AppDialog";
import Button from "@/components/Button";
import { emptyPet, useSelectedPetStore } from "@/context/selectedPetStore";
import { useMemo, useState } from "react";
import { useActiveVetStore } from "@/context/activeVetStore";
import { deletePetWithRelations } from "@/lib/queries/pets";
import { Database } from "@/types/database";
import { usePetFetcher } from "@/hooks/usePetFetcher";

export default function PetButtons() {
  const {
    selectedPet,
    startCreating,
    startEditing,
    setSelectedPet,
    resetSelectedPet,
  } = useSelectedPetStore();

  const activeVet = useActiveVetStore((s) => s.activeVet);

  const { refreshPets } = usePetFetcher();

  const [dialogMessage, setDialogMessage] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [isDeletingPet, setIsDeletingPet] = useState(false);

  const disablePetActions = isDeletingPet;

  const selectedPetName = useMemo(() => {
    if (!selectedPet?.name?.trim()) return "esta mascota";
    return selectedPet.name;
  }, [selectedPet]);

  const handleOpenDeleteConfirmation = () => {
    if (
      !selectedPet ||
      JSON.stringify(selectedPet) === JSON.stringify(emptyPet) ||
      !selectedPet.pet_id
    ) {
      setDialogMessage("Por favor seleccione una mascota");
      setIsAlertDialogOpen(true);
      return;
    }

    setIsDeleteConfirmDialogOpen(true);
  };

  const handleConfirmDeletePet = async () => {
    if (
      !selectedPet ||
      JSON.stringify(selectedPet) === JSON.stringify(emptyPet) ||
      !selectedPet.pet_id
    ) {
      setIsDeleteConfirmDialogOpen(false);
      setDialogMessage("Por favor seleccione una mascota");
      setIsAlertDialogOpen(true);
      return;
    }

    if (!activeVet?.vet_id) {
      setIsDeleteConfirmDialogOpen(false);
      setDialogMessage("No hay un veterinario activo seleccionado");
      setIsAlertDialogOpen(true);
      return;
    }

    const isOwnerOrAdmin =
      activeVet.role === "owner" || activeVet.role === "admin";

    const isOwnerOfPet = selectedPet.vet_id === activeVet.vet_id;

    if (!isOwnerOfPet && !isOwnerOrAdmin) {
      setIsDeleteConfirmDialogOpen(false);
      setDialogMessage(
        "No tiene permiso para borrar esta mascota. Solo puede borrarla el veterinario que la creó, o un usuario con rol owner o admin."
      );
      setIsAlertDialogOpen(true);
      return;
    }

    setIsDeletingPet(true);

    try {
      await deletePetWithRelations(
        selectedPet as Database["public"]["Tables"]["pets"]["Row"]
      );

      setSelectedPet(null);
      resetSelectedPet();

      await refreshPets();

      setIsDeleteConfirmDialogOpen(false);
      setDialogMessage(
        "La mascota, sus consultas y sus imágenes asociadas fueron borradas correctamente."
      );
      setIsAlertDialogOpen(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al borrar la mascota";

      setIsDeleteConfirmDialogOpen(false);
      setDialogMessage(message);
      setIsAlertDialogOpen(true);
    } finally {
      setIsDeletingPet(false);
    }
  };

  return (
    <div className="mb-2 flex flex-col gap-7">
      <Button
        className={`
    w-38
    ${
      disablePetActions
        ? "cursor-not-allowed opacity-80 bg-gray-200 border-gray-300 text-gray-500 hover:bg-gray-200 hover:border-gray-300"
        : ""
    }
  `}
        onClick={() => startCreating()}
        disabled={disablePetActions}
      >
        Nueva Mascota
      </Button>
      <Button
        disabled={disablePetActions}
        className={`
    w-38
    ${
      disablePetActions
        ? "cursor-not-allowed opacity-80 bg-gray-200 border-gray-300 text-gray-500 hover:bg-gray-200 hover:border-gray-300"
        : ""
    }
  `}
        onClick={() => {
          if (
            !selectedPet ||
            JSON.stringify(selectedPet) === JSON.stringify(emptyPet)
          ) {
            setDialogMessage("Por favor seleccione una mascota");
            setIsAlertDialogOpen(true);
            return;
          }

          startEditing();
        }}
      >
        Modificar Mascota
      </Button>
      <div className="flex flex-col items-center">
        <Button
          onClick={handleOpenDeleteConfirmation}
          disabled={disablePetActions}
          className={`
      w-38
      ${
        disablePetActions
          ? "bg-red-200 border-red-300 text-gray-500 cursor-not-allowed hover:bg-red-200 hover:border-red-300 opacity-80"
          : "bg-red-100 border-red-400 hover:bg-red-300 hover:border-red-500"
      }
    `}
        >
          <span className="flex items-center justify-center gap-2">
            {isDeletingPet && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            )}
            <span>{isDeletingPet ? "Borrando..." : "Borrar Mascota"}</span>
          </span>
        </Button>
      </div>

      {/* ========== ALERTS DIALOG ============ */}
      <AppDialog
        isOpen={isDeleteConfirmDialogOpen}
        onClose={() => setIsDeleteConfirmDialogOpen(false)}
        navbarTitle="Confirmar borrado"
        title="¿Seguro que desea borrar esta mascota?"
        description={
          <div className="space-y-3 text-sm">
            <p>
              Está a punto de borrar a{" "}
              <span className="font-semibold">{selectedPetName}</span>.
            </p>

            <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-red-800">
              Esta acción es irreversible. Se eliminará la mascota, todas sus
              consultas y todas las imágenes vinculadas a esas consultas.
            </div>
          </div>
        }
        showCloseButton
        showFooter
        showCancelButton
        cancelLabel="Cancelar"
        confirmLabel="Sí, borrar"
        confirmLoadingLabel="Borrando mascota..."
        onConfirm={handleConfirmDeletePet}
        onCancel={() => setIsDeleteConfirmDialogOpen(false)}
        isLoading={isDeletingPet}
        disableClose={isDeletingPet}
        variant="danger"
        widthClassName="w-[480px]"
      />

      <AppDialog
        isOpen={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
        navbarTitle="Aviso"
        description={dialogMessage}
        showCloseButton
        showFooter
        showCancelButton={false}
        confirmLabel="Aceptar"
        onConfirm={() => setIsAlertDialogOpen(false)}
        widthClassName="w-[420px]"
      />
    </div>
  );
}
