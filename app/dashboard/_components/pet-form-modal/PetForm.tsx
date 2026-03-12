import LabeledInput from "@/components/LabeledInput";

export default function PetForm() {
  return (
    <div className="flex flex-col gap-4 ">
      <LabeledInput labelClassName="w-26" inputClassName="w-75 bg-white">
        Propietario:
      </LabeledInput>
      <LabeledInput labelClassName="w-26" inputClassName="w-75 bg-white">
        Mascota:
      </LabeledInput>
      <LabeledInput labelClassName="w-26" inputClassName="w-75 bg-white">
        Referido por:
      </LabeledInput>
      <LabeledInput labelClassName="w-26" inputClassName="w-75 bg-white">
        Especie:
      </LabeledInput>
      <LabeledInput labelClassName="w-26" inputClassName="w-75 bg-white">
        Raza:
      </LabeledInput>
      <LabeledInput labelClassName="w-26" inputClassName="w-75 bg-white">
        Sexo:
      </LabeledInput>
    </div>
  );
}
