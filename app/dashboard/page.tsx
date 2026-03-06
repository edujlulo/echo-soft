import PatientsTable from "./components/PatientsTable";
import ConsultationsTable from "./components/ConsultationsTable";
import DashboardHeader from "./components/DashboardHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <div className="grid grid-cols-1 gap-6">
        <PatientsTable />
        <ConsultationsTable />
      </div>
    </div>
  );
}
