export default function VeterinariansTable() {
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
  );
}
