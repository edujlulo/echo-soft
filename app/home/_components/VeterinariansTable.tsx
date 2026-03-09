"use client";

import { Vet } from "@/hooks/useVeterinarians";
import { useActiveVetStore } from "@/context/activeVetStore";

interface Props {
  vets: Vet[];
  loading: boolean;
}

export default function VeterinariansTable({ vets, loading }: Props) {
  const { activeVet, setActiveVet } = useActiveVetStore();

  // Filas vacías para mantener altura
  const emptyRows = Array.from({ length: Math.max(0, 9 - vets.length) });

  const handleSelect = (vet: Vet) => {
    setActiveVet(vet);
  };

  return (
    <div>
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
            {loading ? (
              <tr>
                <td
                  colSpan={2}
                  className="border border-blue-300 px-2 py-1 text-center text-blue-700"
                >
                  Cargando veterinarios...
                </td>
              </tr>
            ) : (
              <>
                {vets.map((vet) => (
                  <tr
                    key={vet.vet_id}
                    onClick={() => handleSelect(vet)}
                    className={`h-6 cursor-pointer ${
                      activeVet?.vet_id === vet.vet_id
                        ? "bg-blue-900 text-blue-50"
                        : "bg-[#f5faff]"
                    }`}
                  >
                    <td className="border border-blue-300 px-2 py-1 align-middle">
                      {vet.name}
                    </td>
                    <td className="border border-blue-300 px-2 py-1 align-middle">
                      {vet.registration_number || ""}
                    </td>
                  </tr>
                ))}

                {emptyRows.map((_, i) => (
                  <tr key={i} className="bg-[#f5faff] h-6">
                    <td className="border border-blue-300 px-2 py-1 align-middle"></td>
                    <td className="border border-blue-300 px-2 py-1 align-middle"></td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
