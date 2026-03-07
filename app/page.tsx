"use client";

import Button from "@/components/Button";
import LabeledInput from "@/components/LabeledInput";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="w-[1100px] h-[640px] bg-blue-200 flex flex-col items-center rounded-md text-sm">
      {/* NavBar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* =============== Top sections ================= */}
      <div className="flex flex-row gap-2 mb-7 mr-3">
        {/* First Section */}
        <div className="w-[520px] h-[370px] flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            {/* Logo */}
            <div className="flex flex-col items-center justify-start pl-4 pt-8">
              <img
                src="/images/logointegral.jpg"
                alt="Clinic logo"
                className="w-[300px] h-[200px]"
              />
              <h1 className="text-6xl font-bold pt-4">EcoSoft</h1>
            </div>

            {/* Profile & Signature */}
            <div className="w-[200px] flex flex-col items-center justify-start mt-1">
              <p className="font-bold">Foto de perfil</p>
              <img
                src="images/BLANK.JPG"
                alt="Profile photo"
                className="w-[140px] h-[120px]"
              />
              <div className="my-2 space-x-1 text-sm">
                <Button>Archivo</Button>
                <Button>Zoom</Button>
                <Button>X</Button>
              </div>

              <p className="font-bold text-sm">Firma</p>
              <img
                src="images/BLANK.JPG"
                alt="Signature photo"
                className="w-[120px] h-[100px]"
              />
              <div className="my-2 space-x-1 text-sm">
                <Button>Archivo</Button>
                <Button>Zoom</Button>
                <Button>X</Button>
              </div>
            </div>
          </div>

          {/* Clinic Name */}
          <div className="text-center">
            <h3 className="text-gray-500 font-bold text-lg">
              CLINICA VETERINARIA INTEGRAL VET
            </h3>
          </div>
        </div>

        {/* Second Section */}
        <div className="w-[550px] h-[350px] py-2 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">Ecografistas</h2>

          {/* Contenedor scroll vertical */}
          <div className="overflow-y-auto w-full border border-blue-300 rounded">
            <table className="border-collapse table-fixed w-full text-sm text-blue-950">
              <thead className="bg-blue-100">
                <tr>
                  <th
                    className="border border-blue-300 px-2 py-1 text-center align-middle"
                    style={{ width: "60%" }}
                  >
                    Nombre Veterinario
                  </th>
                  <th
                    className="border border-blue-300 px-2 py-1 text-center align-middle"
                    style={{ width: "40%" }}
                  >
                    Nro. Matrícula o Colegio
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Filas de datos */}
                {[
                  {
                    nombre: "MVZ. HENRY ESTEBAN TABARES ÁLVAREZ",
                    matricula: "COMVEZCOL 41059",
                  },
                  {
                    nombre: "MVZ. ANDRES FELIPE RIASCOS GOMEZ",
                    matricula: "COMVEZCOL 39513",
                  },
                ].map((item, index) => (
                  <tr key={index} className="bg-[#f5faff] h-6">
                    <td className="border border-blue-300 px-2 py-1 align-middle">
                      {item.nombre}
                    </td>
                    <td className="border border-blue-300 px-2 py-1 align-middle">
                      {item.matricula}
                    </td>
                  </tr>
                ))}

                {/* Filas vacías */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <tr key={i} className="bg-[#f5faff] h-6">
                    <td className="border border-blue-300 px-2 py-1 align-middle"></td>
                    <td className="border border-blue-300 px-2 py-1 align-middle"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =============== Bottom sections ================= */}

      <div className="w-full flex flex-row gap-6 items-center justify-center">
        {/* Third Section */}
        <div className="w-[62%] bg-[#f5faff] relative rounded p-4 mx-2 ">
          <div className="absolute top-0 left-0 bg-[#3399ff] px-8 py-1 rounded-tr-none rounded-bl-none rounded-tl rounded-br-0 text-sm">
            Inicio de Sesion
          </div>
          <form className="mt-4 space-y-3 mr-4">
            <div className="flex justify-center items-center">
              <label className="font-bold px-2">Serial Nro.</label>
              <span className="text-[#1344a0] font-bold">500</span>
            </div>

            <LabeledInput
              defaultValue="VALLE DEL CAUCA - COLOMBIA"
              disabled={true}
            >
              Dirección
            </LabeledInput>

            <LabeledInput disabled={true} inputClassName="flex-none w-110">
              Teléfonos
            </LabeledInput>

            <div className="flex flex-row">
              <LabeledInput
                labelClassName="w-52"
                inputClassName="flex-none w-16"
              >
                Introduzca su clave por favor
              </LabeledInput>

              <Button className="ml-auto px-3 py-1 bg-green-300 border border-gray-50 hover:bg-green-400 relative -translate-y-4">
                SALIR
              </Button>
            </div>
          </form>
        </div>

        {/* Fourth Section */}
        <div className="flex flex-col items-center justify-center text-center -translate-y-4 scale-y-115 scale-x-110 ">
          <p className="text-3xl font-bold m-0">VERSIÓN CLÍNICAS</p>
          <p className="text-4xl font-bold mt-2">07/03/2026</p>
          <div className="mt-5">
            <p className="bg-[#3399ff] w-[320px] rounded-t-md m-0">
              Fecha en que se actualizo el exe:
            </p>
            <p className="bg-[#f5faff] text-red-600 text-2xl font-semibold w-[320px] rounded-b-md m-0 py-4">
              07/03/2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
