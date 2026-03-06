"use client";

import Button from "@/components/Button";
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
      <div className="flex flex-row gap-2">
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
                className="w-[120px] h-[100px]"
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
        <div className="w-[550px] h-[350px] py-2 flex flex-col gap-1 items-center">
          <h2 className="text-2xl font-bold">Ecografistas</h2>

          {/* Contenedor scroll vertical fijo */}
          <div className="overflow-y-auto overflow-x-hidden border border-blue-300 rounded">
            <table className=" border-collapse table-fixed">
              <thead>
                <tr className="bg-blue-100">
                  <th
                    className="border border-blue-300 px-2 py-1 text-left align-top resize-x overflow-hidden"
                    style={{ width: "60%" }}
                  >
                    Nombre Veterinario
                  </th>
                  <th
                    className="border border-blue-300 px-2 py-1 text-left align-top resize-x overflow-hidden"
                    style={{ width: "40%" }}
                  >
                    Nro. Matrícula o Colegio
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="bg-[#f5faff] h-5">
                  <td className="border border-blue-300 px-2">
                    MVZ. HENRY ESTEBAN TABARES ÁLVAREZ
                  </td>
                  <td className="border border-blue-300 px-2">
                    COMVEZCOL 41059
                  </td>
                </tr>
                <tr className="bg-[#f5faff] h-5">
                  <td className="border border-blue-300 px-2">
                    MVZ. ANDRES FELIPE RIASCOS GOMEZ
                  </td>
                  <td className="border border-blue-300 px-2">
                    COMVEZCOL 39513
                  </td>
                </tr>
                {/* Filas vacías */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <tr key={i} className="bg-[#f5faff] h-5">
                    <td className="border border-blue-300 px-2"></td>
                    <td className="border border-blue-300 px-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =============== Bottom sections ================= */}

      <div className="w-full flex flex-row gap-6 mb-2 items-center justify-center">
        {/* Third Section */}
        <div className="w-[62%] bg-[#f5faff] relative rounded p-4 mx-4 ">
          <div className="absolute top-0 left-0 bg-[#3399ff] px-8 py-1 rounded-tr-none rounded-bl-none rounded-tl rounded-br-0 text-sm">
            Inicio de Sesion
          </div>
          <form className="mt-4 space-y-3">
            <div className="flex justify-center items-center">
              <label className="font-bold px-2">Serial Nro.</label>
              <span className="text-[#1344a0] font-bold">500</span>
            </div>
            <div className="flex items-center">
              <label className="px-2 w-40">Dirección</label>
              <input
                className="flex-1 border border-blue-300 px-2 py-0.5 text-sm rounded"
                defaultValue="VALLE DEL CAUCA - COLOMBIA"
                disabled={true}
              />
            </div>
            <div className="flex items-center">
              <label className="px-2 w-40">Teléfonos</label>
              <input className="flex-1 border border-gray-300 p-1 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <label className="px-2">Introduzca su clave por favor</label>
              <input
                id="inputPasswordThirdSection"
                className="border border-gray-300 p-1 w-16 rounded ml-2"
              />
              <button className="ml-auto mr-5 px-3 py-1 bg-[#86f9ae] border border-gray-300 rounded">
                SALIR
              </button>
            </div>
          </form>
        </div>

        {/* Fourth Section */}
        <div className="flex flex-col items-center justify-center text-center col-span-1 mt-2">
          <p className="text-2xl font-bold m-0">VERSIÓN CLÍNICAS</p>
          <p className="text-4xl font-bold mt-2">05/06/2025</p>
          <p className="bg-[#3399ff] w-[320px] rounded-t-md m-0">
            Fecha en que se actualizo el exe:
          </p>
          <p className="bg-[#f5faff] text-red-600 text-xl font-semibold w-[320px] rounded-b-md m-0 py-3">
            01/06/2025
          </p>
        </div>
      </div>
    </div>
  );
}
