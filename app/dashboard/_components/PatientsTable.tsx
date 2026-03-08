"use client";
export default function PatientsTable() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Patients</h3>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Species</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Buddy</td>
            <td className="border p-2">Dog</td>
            <td className="border p-2">4</td>
            <td className="border p-2 space-x-2">
              <button className="text-blue-600 hover:underline">View</button>
              <button className="text-green-600 hover:underline">Edit</button>
              <button className="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
