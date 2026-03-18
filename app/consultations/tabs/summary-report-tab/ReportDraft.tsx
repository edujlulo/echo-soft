export default function ReportDraft() {
  return (
    <>
      <div className="-mt-4 px-2 flex flex-col gap-1 items-start text-sm">
        <label className="w-full font-bold text-blue-950 items-center justify-center text-center text-lg">
          Informe creado desde plantilla o memoria
        </label>

        <textarea
          // type={type}
          // value={value ?? ""}
          // onChange={handleChange}
          className="w-[700px] h-[565px] bg-white border border-blue-200 px-2 pb-0.5 pt-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:bg-white"
        />
      </div>
    </>
  );
}
