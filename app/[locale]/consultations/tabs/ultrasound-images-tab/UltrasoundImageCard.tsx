"use client";

import AppDialog from "@/components/AppDialog";
import Button from "@/components/Button";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Image {
  id: string;
  src: string;
  alt: string;
}

interface Props {
  image: Image;
  index: number;
  onZoom: (index: number) => void;
  isSelected: boolean;
  onToggleSelection: (imageId: string) => void;
  isSelectionDisabled: boolean;
  onDeleteComplete?: () => Promise<void> | void;
  deleteUltrasoundImage: (imageId: string) => Promise<void>;
  deletingImageId: string | null;
}

export default function UltrasoundImageCard({
  image,
  index,
  onZoom,
  isSelected,
  onToggleSelection,
  isSelectionDisabled,
  onDeleteComplete,
  deleteUltrasoundImage,
  deletingImageId,
}: Props) {
  const t = useTranslations("UltrasoundImagesTab");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isDeletingThisImage = deletingImageId === image.id;

  return (
    <div className="border border-gray-300 rounded-md p-2 bg-white">
      <div className="relative">
        <label
          className="absolute left-0 top-0 z-10 flex h-11 w-11 cursor-pointer items-start justify-start p-2"
          onClick={(event) => event.stopPropagation()}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/80 shadow-sm ring-1 ring-gray-300">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(image.id)}
              disabled={isSelectionDisabled}
              className="h-4 w-4 cursor-pointer accent-blue-600"
              aria-label={t("selectImage")}
            />
          </span>
        </label>

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
      </div>

      <div className="mt-2 flex justify-between gap-2">
        <Button
          type="button"
          className="flex-1"
          onClick={() => onZoom(index)}
          disabled={isDeletingThisImage || isSelectionDisabled}
        >
          {t("zoom")}
        </Button>

        <Button
          type="button"
          className="w-10 flex items-center justify-center"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeletingThisImage || isSelectionDisabled}
        >
          X
        </Button>
        <AppDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          navbarTitle={t("confirmDeleteTitle")}
          title={t("deleteImageTitle")}
          description={
            <>
              <p>{t("deleteImageQuestion")}</p>
              <p className="mt-2 font-semibold text-red-700">
                {t("irreversibleWarning")}
              </p>
            </>
          }
          confirmLabel={t("delete")}
          confirmLoadingLabel={t("deletingImage")}
          cancelLabel={t("cancel")}
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
