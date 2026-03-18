"use client";

import LabeledInput from "@/components/LabeledInput";
import Navbar from "@/components/Navbar";
import ConsultationTabs from "./ConsultationTabs";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import { useActiveVetStore } from "@/context/activeVetStore";

export default function ConsultationsPage() {
  const router = useRouter();

  const { activeVet } = useActiveVetStore();
  const { selectedPet } = useSelectedPetStore();

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <div className="w-[1600px] h-[800px] bg-gray-300 flex flex-col rounded-md text-sm">
        {/* NavBar */}
        <div className="w-full">
          <Navbar>Consulta de Ecografía</Navbar>
        </div>

        {/* Contenedor principal */}
        <div className="flex flex-col flex-1">
          {/* Top label-inputs */}
          <div className="mx-4 my-0.5 flex flex-row gap-4">
            <LabeledInput
              labelClassName="font-bold"
              inputClassName="w-55 bg-white"
              value={selectedPet?.name}
            >
              MASCOTA:
            </LabeledInput>
            <LabeledInput
              labelClassName="font-bold w-30"
              inputClassName="w-90 bg-white"
              value={selectedPet?.owner}
            >
              PROPIETARIO:
            </LabeledInput>
            <LabeledInput
              labelClassName="font-bold w-30"
              inputClassName="w-90 bg-white"
              value={activeVet?.name}
            >
              VETERINARIO:
            </LabeledInput>

            {/* Close button */}
            <div className="ml-auto mr-10">
              <Button
                onClick={navigateToDashboard}
                className="flex w-20 items-center justify-center px-3 py-1 font-bold bg-green-300 border border-gray-50 hover:bg-green-400"
              >
                Cerrar
              </Button>
            </div>
          </div>

          {/* Consultation tabs section */}
          <div className="flex flex-col flex-1">
            <ConsultationTabs />
          </div>
        </div>
      </div>
    </>
  );
}
