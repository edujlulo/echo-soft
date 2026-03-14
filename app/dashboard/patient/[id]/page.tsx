"use client";

export default function PatientPage({ params }: { params: { id: string } }) {
  return <div>Paciente {params.id}</div>;
}
