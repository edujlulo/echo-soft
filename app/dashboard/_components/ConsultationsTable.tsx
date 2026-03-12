"use client";
export default function ConsultationsTable() {
  const emptyRows = Array.from({ length: 15 });

  return (
    <div>
      <div className="h-[195px] overflow-y-auto w-full border border-blue-300 rounded">
        <table className="border-collapse table-fixed w-full text-sm text-blue-950">
          <thead className="bg-blue-100">
            <tr>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "3%" }}
              ></th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "20%" }}
              >
                Fecha
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "40%" }}
              >
                Veterinario
              </th>
              <th
                className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                style={{ width: "35%" }}
              >
                Especialidad
              </th>
            </tr>
          </thead>

          <tbody>
            {emptyRows.map((_, i) => (
              <tr key={i} className="bg-[#f5faff] h-6">
                <td className="border border-blue-300 px-2 pt-0.5 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-0.5 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-0.5 align-middle"></td>
                <td className="border border-blue-300 px-2 pt-0.5 align-middle"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
