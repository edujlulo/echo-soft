"use client";

import Button from "@/components/Button";
import { useSelectedPetStore, emptyPet } from "@/context/selectedPetStore";
import { useConsultationForm } from "@/hooks/useConsultationForm";
import { useConsultations } from "@/hooks/useConsultations";
import { useRouter } from "next/navigation";

export default function ConsultationsButtons() {
  const router = useRouter();

  const { selectedPet } = useSelectedPetStore();
  const { selectedConsultation } = useConsultationForm();

  const { addConsultation } = useConsultations();

  function navigateToHome() {
    router.push("/home");
  }

  const navigateToConsultations = () => {
    router.push("/consultations");
  };

  return (
    <div className="flex flex-col gap-1 justify-center items-center">
      <Button
        className="w-33"
        onClick={() => {
          if (!selectedConsultation?.consultation_id) {
            window.alert("Por favor seleccione una consulta");
            return;
          }

          navigateToConsultations();
        }}
      >
        Ver Consulta
      </Button>
      <Button
        className="w-33"
        onClick={() => {
          if (
            !selectedPet ||
            JSON.stringify(selectedPet) === JSON.stringify(emptyPet)
          ) {
            window.alert("Por favor seleccione una mascota");
            return;
          }

          addConsultation(selectedPet?.pet_id ?? "");
          navigateToConsultations();
        }}
      >
        Crear Ecografía
      </Button>
      <Button className="w-33">Desde memoria</Button>
      <Button className="w-33">Borrar Consulta</Button>
      <Button className="w-33">Historial Médico</Button>
      <Button
        onClick={navigateToHome}
        className="flex w-20 mt-1 items-center justify-center px-3 py-1 font-bold bg-green-300 border border-gray-50 hover:bg-green-400"
      >
        Cerrar
      </Button>
    </div>
  );
}
