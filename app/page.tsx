"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="bg-blue-200 flex flex-col items-center rounded-md">
      {/* NavBar */}
      <div className="w-full ">
        <Navbar />
      </div>

      {/* =============== Top sections ================= */}
      <div className="flex flex-row gap-6">
        {/* First Section */}
        <div className=" grid grid-cols-2 grid-rows-[auto_auto] gap-2 col-span-1">
          {/* Logo */}
          <div className="flex flex-col items-center justify-start pl-4 pt-8">
            <img
              src="/images/logointegral.jpg"
              alt="Clinic logo"
              className="w-[300px] h-[200px]"
            />
            <h1 className="text-6xl font-bold pt-4 m-0">EcoSoft</h1>
          </div>

          {/* Profile & Signature */}
          <div className="flex flex-col items-center justify-start ">
            <p className="font-bold my-2">Foto de perfil</p>
            <img
              src="images/BLANK.JPG"
              alt="Profile photo"
              className="w-[120px] h-[100px]"
            />
            <div className="my-2 space-x-2 text-sm">
              <button className="px-3  bg-gray-200 rounded">Archivo</button>
              <button className="px-3  bg-gray-200 rounded">Zoom</button>
              <button className="px-3  bg-gray-200 rounded">X</button>
            </div>

            <p className="font-bold text-sm">Firma</p>
            <img
              src="images/BLANK.JPG"
              alt="Signature photo"
              className="w-[120px] h-[100px]"
            />
            <div className="my-2 space-x-2 text-sm">
              <button className="px-3 py-1 bg-gray-200 rounded">Archivo</button>
              <button className="px-3 py-1 bg-gray-200 rounded">Zoom</button>
              <button className="px-3 py-1 bg-gray-200 rounded">X</button>
            </div>
          </div>

          {/* Clinic Name */}
          <div className="col-span-2 text-center mt-2">
            <h3 className="text-gray-500 font-bold text-lg">
              CLINICA VETERINARIA INTEGRAL VET
            </h3>
          </div>
        </div>

        {/* Second Section */}
        <div className=" p-4 col-span-1">
          <h2 className="text-3xl font-bold mb-2">Ecografistas</h2>
          <table className="w-full border border-black">
            <thead>
              <tr className="bg-aqua-500">
                <th className="w-[345px] bg-aqua-400">Nombre Veterinario</th>
                <th className="w-[240px] bg-aqua-400">
                  Nro. Matrícula o Colegio
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="bg-[#f5faff] h-5">
                <td>MVZ. HENRY ESTEBAN TABARES ÁLVAREZ</td>
                <td>COMVEZCOL 41059</td>
              </tr>
              <tr className="bg-[#f5faff] h-5">
                <td>MVZ. ANDRES FELIPE RIASCOS GOMEZ</td>
                <td>COMVEZCOL 39513</td>
              </tr>
              {/* Empty rows */}
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="bg-[#f5faff] h-5">
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =============== Bottom sections ================= */}

      <div className="flex flex-row gap-6 mb-2">
        {/* Third Section */}
        <div className="bg-[#f5faff] relative rounded p-4">
          <div className="absolute top-0 left-0 bg-[#3399ff] px-8 py-1 rounded-tr-none rounded-bl-none rounded-tl rounded-br-0 text-sm">
            Inicio de Sesion
          </div>
          <form className="mt-10 space-y-3">
            <div className="flex justify-center items-center">
              <label className="font-bold px-2">Serial Nro.</label>
              <span className="text-[#1344a0] font-bold">500</span>
            </div>
            <div className="flex items-center">
              <label className="px-2 w-40">Dirección</label>
              <input
                className="flex-1 border border-gray-300 p-1 rounded"
                defaultValue="VALLE DEL CAUCA - COLOMBIA"
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
