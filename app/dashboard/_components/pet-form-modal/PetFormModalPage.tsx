"use client";

import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import PetForm from "./PetForm";
import PetImage from "../PetImage";
import EditableSelectList from "../../../../components/EditableSelectList";
import { usePetForm } from "@/hooks/usePetForm";
import { Database } from "@/types/database";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { usePetFetcher } from "@/hooks/usePetFetcher";

type PetFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Pet = Database["public"]["Tables"]["pets"]["Row"];

export default function PetFormModal({ isOpen, onClose }: PetFormModalProps) {
  const { refreshPets } = usePetFetcher();
  const { setSelectedPet } = useSelectedPetStore();

  const onSuccess = (newPet: Pet) => {
    refreshPets();
    setSelectedPet(newPet);
    onClose();
  };

  const { selectedPet, setField, errors, submit, isSubmitting, statusMessage } =
    usePetForm(onSuccess);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 ">
      <div className="w-[1000px]  bg-gray-100 rounded-md shadow-lg">
        {/* ========= NAVBAR ========= */}
        <div className="w-full">
          <Navbar>Nueva Mascota...</Navbar>
        </div>
        <div className="p-4 flex flex-col gap-2 items-center justify-center">
          {/* ======= TITLE ========= */}
          <h1 className="text-2xl font-semibold">MASCOTA</h1>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4">
              {/* Left Section */}
              <div className="flex flex-col gap-2">
                {/* ======== PET FORM ========= */}
                <div className="h-full pb-10 flex justify-center items-center ">
                  {selectedPet && (
                    <PetForm
                      selectedPet={selectedPet as Pet}
                      setField={setField}
                      errors={errors}
                      statusMessage={statusMessage}
                    />
                  )}
                </div>

                {/* ======== BUTTONS ======== */}
                <div className="pl-6 pb-2 flex flex-row gap-4 justify-start items-start">
                  <Button onClick={submit} disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : "Grabar"}
                  </Button>
                  <Button onClick={onClose}>Cancelar</Button>
                </div>
              </div>

              {/* Central Section */}
              <div className="pt-4">
                <PetImage />
              </div>

              {/* Right Section */}
              <div>
                <EditableSelectList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
