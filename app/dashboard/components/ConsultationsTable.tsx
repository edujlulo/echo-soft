"use client";
export default function ConsultationsTable() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Consultations</h3>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Doctor</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">2026-03-06</td>
            <td className="border p-2">Ultrasound</td>
            <td className="border p-2">Dr. Smith</td>
            <td className="border p-2 space-x-2">
              <button className="text-blue-600 hover:underline">View</button>
              <button className="text-green-600 hover:underline">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
