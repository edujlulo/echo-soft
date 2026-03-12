"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function ConsultationsButtons() {
  const router = useRouter();

  function navigateToHome() {
    router.push("/home");
  }

  return (
    <div className="flex flex-col gap-1 justify-center items-center">
      <Button className="w-33">Ver Consulta</Button>
      <Button className="w-33">Desde memoria</Button>
      <Button className="w-33">Crear Ecografía</Button>
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
