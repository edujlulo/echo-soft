import Button from "@/components/Button";

export default function UltrasoundImagesActions() {
  return (
    <div className="flex flex-col gap-2 justify-center items-start">
      <Button>Copiar JPG BMP JPEG PNG desde la carpeta?</Button>
      <Button>Copiar imágenes JPG desde la carpeta?</Button>
      <Button>Copiar imágenes BMP desde la carpeta?</Button>
      <Button>Borrar todas las imágenes</Button>
    </div>
  );
}
