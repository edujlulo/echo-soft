"use client";

export default function PatientsTable() {
  const emptyRows = Array.from({ length: 15 }); // 15 filas vacías

  return (
    <div>
      <div className="h-[295px] overflow-y-auto w-full border border-blue-300 rounded">
        <table className="border-collapse table-fixed w-full text-sm text-blue-950">
          <thead className="bg-blue-100">
            <tr>
              <th
                className="border border-blue-300 px-2 pt-1 text-center align-middle"
                style={{ width: "12%" }}
              >
                Núm. Historia
              </th>
              <th
                className="border border-blue-300 px-2 pt-1 text-center align-middle"
                style={{ width: "20%" }}
              >
                Nombre Mascota
              </th>
              <th
                className="border border-blue-300 px-2 pt-1 text-center align-middle"
                style={{ width: "30%" }}
              >
                Apellido Nombre Propietario
              </th>
              <th
                className="border border-blue-300 px-2 pt-1 text-center align-middle"
                style={{ width: "10%" }}
              >
                Especie
              </th>
              <th
                className="border border-blue-300 px-2 pt-1 text-center align-middle"
                style={{ width: "20%" }}
              >
                Raza
              </th>
              <th
                className="border border-blue-300 px-2 pt-1 text-center align-middle"
                style={{ width: "15%" }}
              >
                Sexo
              </th>
              <th
                className="border border-blue-300 px-2 pt-1 text-center align-middle"
                style={{ width: "12%" }}
              >
                F. Nacimiento
              </th>
              <th
                className="border border-blue-300 px-2 pt-1 text-center align-middle"
                style={{ width: "30%" }}
              >
                Diagnóstico
              </th>
            </tr>
          </thead>

          <tbody>
            {emptyRows.map((_, i) => (
              <tr key={i} className="bg-[#f5faff] h-6">
                <td className="border border-blue-300 px-2 pt-1 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-1 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-1 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-1 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-1 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-1 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-1 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-1 align-middle"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
