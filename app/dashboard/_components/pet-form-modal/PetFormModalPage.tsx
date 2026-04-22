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
import { Dialog } from "@headlessui/react";

type PetFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Pet = Database["public"]["Tables"]["pets"]["Row"];

export default function PetFormModal({ isOpen, onClose }: PetFormModalProps) {
  const { refreshPets } = usePetFetcher();
  const setSelectedPet = useSelectedPetStore((s) => s.setSelectedPet);
  const isCreating = useSelectedPetStore((s) => s.isCreating);

  const onSuccess = (newPet: Pet) => {
    refreshPets();
    setSelectedPet(newPet);
    onClose();
  };

  const {
    selectedPet,
    setField,
    errors,
    setErrors,
    submit,
    isSubmitting,
    statusMessage,
  } = usePetForm(onSuccess);

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Center container */}
      <div className="fixed inset-0 flex overflow-auto">
        <div className="m-auto self-start">
          <Dialog.Panel className="w-[1100px] h-[600px] flex flex-col bg-gray-100 rounded-md shadow-lg mx-auto my-auto self-start overflow-x-auto overflow-y-auto">
            {/* ========= NAVBAR ========= */}
            <div className="w-full">
              <Navbar>Nueva Mascota...</Navbar>
            </div>

            <div className="flex-1 min-h-0 p-4 flex flex-col gap-2 items-center justify-center">
              {/* ======= TITLE ========= */}
              <h1 className="pr-12 text-2xl font-semibold">MASCOTA</h1>

              <div className="w-full min-h-0 flex flex-col gap-2">
                <div className="w-full min-h-0 flex flex-row gap-5">
                  {/* Left Section */}
                  <div className=" flex flex-col gap-2">
                    {/* ======== PET FORM ========= */}
                    <div className="h-full pb-10 flex justify-center items-center">
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

                      <Button
                        onClick={() => {
                          setErrors({});
                          onClose();
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>

                  {/* Central Section */}
                  <div className="pt-4">
                    {!isCreating ? <PetImage /> : <div className="px-10"></div>}
                  </div>

                  {/* Right Section */}
                  <div>
                    <EditableSelectList setField={setField} />
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
