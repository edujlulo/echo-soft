"use client";

import UltrasoundImageCard from "./UltrasoundImageCard";

interface Image {
  id: string;
  src: string;
  alt: string;
}

interface Props {
  images: Image[];
  onZoom: (index: number) => void;
  selectedImageIds: Set<string>;
  onToggleSelection: (imageId: string) => void;
  isSelectionDisabled: boolean;
  deletingImageIds: string[];
  onDeleteComplete?: () => Promise<void> | void;
  deleteUltrasoundImage: (imageId: string) => Promise<void>;
  deletingImageId: string | null;
}

export default function UltrasoundImagesGrid({
  images,
  onZoom,
  selectedImageIds,
  onToggleSelection,
  isSelectionDisabled,
  deletingImageIds,
  onDeleteComplete,
  deleteUltrasoundImage,
  deletingImageId,
}: Props) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {images.map((image, index) => (
        <UltrasoundImageCard
          key={image.id}
          image={image}
          index={index}
          onZoom={onZoom}
          isSelected={selectedImageIds.has(image.id)}
          onToggleSelection={onToggleSelection}
          isSelectionDisabled={
            isSelectionDisabled || deletingImageIds.includes(image.id)
          }
          onDeleteComplete={onDeleteComplete}
          deleteUltrasoundImage={deleteUltrasoundImage}
          deletingImageId={deletingImageId}
        />
      ))}
    </div>
  );
}
