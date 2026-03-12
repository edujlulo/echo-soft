import Button from "@/components/Button";

type PetButtonsProps = {
  onNewPetClick: () => void;
};

export default function PetButtons({ onNewPetClick }: PetButtonsProps) {
  return (
    <div className="flex flex-col gap-7">
      <Button className="w-38" onClick={onNewPetClick}>
        Nueva Mascota
      </Button>
      <Button>Modificar Mascota</Button>
      <Button>Borrar Mascota</Button>
    </div>
  );
}
