import PatientsTable from "./_components/PatientsTable";
import ConsultationsTable from "./_components/ConsultationsTable";
import DashboardHeader from "./_components/DashboardHeader";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <div className="w-[1400px] h-[700px] bg-blue-200 flex flex-col rounded-md text-sm">
      {/* NavBar */}
      <div className="w-full">
        <Navbar>Propietarios</Navbar>
      </div>

      {/* =============== Top sections ================= */}
      <div className="flex flex-col gap-2 mx-2">
        <DashboardHeader />
        <PatientsTable />
      </div>

      {/* =============== Bottom sections ================= */}
    </div>
  );
}
