"use client";
import { useState } from "react";

export default function NewConsultationPage() {
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Consultation submitted");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">New Consultation / Ultrasound</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Consultation Type"
          className="w-full p-2 border rounded"
        />
        <input type="date" className="w-full p-2 border rounded" />
        <textarea placeholder="Notes" className="w-full p-2 border rounded" />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}
