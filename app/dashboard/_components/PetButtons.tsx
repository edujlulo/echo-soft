import Button from "@/components/Button";

export default function PetButtons() {
  return (
    <div className="flex flex-col gap-7">
      <Button className="w-38">Nueva Mascota</Button>
      <Button>Modificar Mascota</Button>
      <Button>Borrar Mascota</Button>
    </div>
  );
}
