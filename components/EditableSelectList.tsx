import Button from "@/components/Button";

export default function EditableSelectList() {
  const emptyRows = Array.from({ length: 18 });

  return (
    <div>
      <div className="px-4 py-4 bg-cyan-300 flex flex-col gap-2 justify-center items-center">
        <h1 className="w-full bg-white text-center text-xl text-blue-600 font-semibold">
          PROPIETARIOS
        </h1>
        <p className="w-full text-blue-800 text-start font-semibold">
          Haga doble click para seleccionar el valor
        </p>

        {/* ====== TABLE ====== */}
        <div>
          <div className="h-[420px] overflow-y-auto w-full border border-blue-300 rounded">
            <table className="border-collapse table-fixed w-full text-sm text-blue-950">
              <thead className="bg-blue-100">
                <tr>
                  <th
                    className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                    style={{ width: "5%" }}
                  ></th>
                  <th
                    className="border border-blue-300 px-2 pt-0.5 text-center align-middle"
                    style={{ width: "95%" }}
                  >
                    Frase
                  </th>
                </tr>
              </thead>

              <tbody>
                {emptyRows.map((_, i) => (
                  <tr key={i} className="bg-[#f5faff] h-6">
                    <td className="border border-blue-300 px-2 pt-0.5 align-middle"></td>
                    <td className="border border-blue-300 px-2 pt-0.5 align-middle"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======== BUTTONS ======== */}
        <div className="flex flex-row gap-3">
          <Button>Agregar</Button>
          <Button>Modificar</Button>
          <Button>Eliminar</Button>
        </div>
      </div>
    </div>
  );
}
