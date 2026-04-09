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
  onDeleteComplete?: () => Promise<void> | void;
}

export default function UltrasoundImagesGrid({
  images,
  onZoom,
  onDeleteComplete,
}: Props) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {images.map((image, index) => (
        <UltrasoundImageCard
          key={image.id}
          image={image}
          index={index}
          onZoom={onZoom}
          onDeleteComplete={onDeleteComplete}
        />
      ))}
    </div>
  );
}
