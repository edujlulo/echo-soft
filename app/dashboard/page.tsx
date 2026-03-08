import PatientsTable from "./_components/PatientsTable";
import ConsultationsTable from "./_components/ConsultationsTable";
import DashboardHeader from "./_components/DashboardHeader";

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
