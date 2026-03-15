"use client";

import { useEffect, useState } from "react";
import { usePetFetcher } from "@/hooks/usePetFetcher";
import { useSelectedPetStore } from "@/context/selectedPetStore";

export default function PatientsTable() {
  const { pets, isLoading } = usePetFetcher();
  const { setSelectedPet, selectedPet } = useSelectedPetStore();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const emptyRows = Array.from({ length: 15 });

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading || pets.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex =
            prev === null ? 0 : Math.min(prev + 1, pets.length - 1);
          setSelectedPet(pets[nextIndex]);
          scrollToRow(nextIndex);
          return nextIndex;
        });
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex =
            prev === null ? pets.length - 1 : Math.max(prev - 1, 0);
          setSelectedPet(pets[nextIndex]);
          scrollToRow(nextIndex);
          return nextIndex;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pets, isLoading, setSelectedPet]);

  // Scroll para mantener la fila visible
  const scrollToRow = (index: number) => {
    const row = document.getElementById(`pet-row-${index}`);
    if (!row) return;

    const container = row.closest(".overflow-y-auto") as HTMLElement;
    if (!container) return;

    const headHeight = 23;

    const rowTop = row.offsetTop;
    const rowBottom = rowTop + row.offsetHeight;

    const viewTop = container.scrollTop + headHeight;
    const viewBottom = container.scrollTop + container.clientHeight;

    // si la fila está arriba del visible
    if (rowTop < viewTop) {
      container.scrollTop = rowTop - headHeight;
    }

    // si la fila está abajo del visible
    if (rowBottom > viewBottom) {
      container.scrollTop = rowBottom - container.clientHeight;
    }
  };

  return (
    <div>
      <div className="h-[295px] overflow-y-auto w-full border border-blue-300 rounded">
        <table className="border-collapse table-fixed w-full text-sm text-blue-950">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "12%" }}
              >
                Núm. Historia
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "20%" }}
              >
                Nombre Mascota
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "30%" }}
              >
                Propietario
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "10%" }}
              >
                Especie
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "20%" }}
              >
                Raza
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "15%" }}
              >
                Sexo
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "12%" }}
              >
                F. Nacimiento
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "30%" }}
              >
                Diagnóstico
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {isLoading && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-2 font-bold text-blue-800"
                >
                  Cargando mascotas...
                </td>
              </tr>
            )}

            {/* Pets */}
            {!isLoading &&
              pets.map((pet, index) => (
                <tr
                  id={`pet-row-${index}`}
                  key={pet.pet_id}
                  className={`h-6 cursor-pointer ${
                    selectedPet?.pet_id === pet.pet_id
                      ? "bg-blue-900 text-blue-50"
                      : "bg-[#f5faff] hover:bg-blue-200"
                  }`}
                  onClick={() => {
                    setSelectedPet(pet);
                    setSelectedIndex(index);
                  }}
                >
                  <td className="border border-blue-300 px-2 pt-0.5">
                    {pet.record_number}
                  </td>

                  <td className="border border-blue-300 px-2 pt-0.5">
                    {pet.name}
                  </td>

                  <td className="border border-blue-300 px-2 pt-0.5">
                    {pet.owner}
                  </td>

                  <td className="border border-blue-300 px-2 pt-0.5">
                    {pet.species}
                  </td>

                  <td className="border border-blue-300 px-2 pt-0.5">
                    {pet.breed}
                  </td>

                  <td className="border border-blue-300 px-2 pt-0.5">
                    {pet.sex}
                  </td>

                  <td className="border border-blue-300 px-2 pt-0.5">
                    {pet.birth_date}
                  </td>

                  <td className="border border-blue-300 px-2 pt-0.5">
                    {pet.diagnosis}
                  </td>
                </tr>
              ))}

            {/* Filas vacías para mantener altura */}
            {!isLoading &&
              pets.length < 15 &&
              emptyRows.slice(pets.length).map((_, i) => (
                <tr key={i} className="bg-[#f5faff] h-6">
                  <td className="border border-blue-300 px-2 pt-0.5"></td>
                  <td className="border border-blue-300 px-2 pt-0.5"></td>
                  <td className="border border-blue-300 px-2 pt-0.5"></td>
                  <td className="border border-blue-300 px-2 pt-0.5"></td>
                  <td className="border border-blue-300 px-2 pt-0.5"></td>
                  <td className="border border-blue-300 px-2 pt-0.5"></td>
                  <td className="border border-blue-300 px-2 pt-0.5"></td>
                  <td className="border border-blue-300 px-2 pt-0.5"></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
