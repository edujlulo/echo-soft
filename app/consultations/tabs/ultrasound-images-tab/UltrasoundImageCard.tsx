"use client";

import AppDialog from "@/components/AppDialog";
import Button from "@/components/Button";
import { useState } from "react";
import { useUltrasoundImages } from "@/hooks/useUltrasoundImages";

interface Image {
  id: string;
  src: string;
  alt: string;
}

interface Props {
  image: Image;
  index: number;
  onZoom: (index: number) => void;
  onDeleteComplete?: () => Promise<void> | void;
}

export default function UltrasoundImageCard({
  image,
  index,
  onZoom,
  onDeleteComplete,
}: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { deleteUltrasoundImage, deletingImageId } = useUltrasoundImages();

  const isDeletingThisImage = deletingImageId === image.id;

  return (
    <div className="border border-gray-300 rounded-md p-2 bg-white">
      <button
        type="button"
        onClick={() => onZoom(index)}
        className="w-full cursor-pointer"
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full aspect-square object-cover rounded"
        />
      </button>

      <div className="mt-2 flex justify-between gap-2">
        <Button
          type="button"
          className="flex-1"
          onClick={() => onZoom(index)}
          disabled={isDeletingThisImage}
        >
          Zoom
        </Button>

        <Button
          type="button"
          className="w-10 flex items-center justify-center"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeletingThisImage}
        >
          X
        </Button>
        <AppDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          navbarTitle="Confirmar eliminación"
          title="Eliminar imagen"
          description={
            <>
              <p>¿Estás seguro de que deseas eliminar esta imagen?</p>
              <p className="mt-2 font-semibold text-red-700">
                Esta acción no se puede deshacer.
              </p>
            </>
          }
          confirmLabel="Eliminar"
          confirmLoadingLabel="Borrando imagen..."
          cancelLabel="Cancelar"
          variant="danger"
          isLoading={isDeletingThisImage}
          disableClose={isDeletingThisImage}
          onConfirm={async () => {
            try {
              await deleteUltrasoundImage(image.id);
              await onDeleteComplete?.();
              setIsDeleteDialogOpen(false);
            } catch (error) {
              console.error("Delete image error:", error);
            }
          }}
        />
      </div>
    </div>
  );
}
