"use client";
export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="space-x-2">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          New Patient
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New Consultation
        </button>
      </div>
    </div>
  );
}
