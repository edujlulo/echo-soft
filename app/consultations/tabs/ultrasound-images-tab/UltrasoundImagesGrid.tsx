"use client";

import UltrasoundImageCard from "./UltrasoundImageCard";

interface Image {
  id: number;
  src: string;
  alt: string;
}

interface Props {
  images: Image[];
  onZoom: (index: number) => void;
}

export default function UltrasoundImagesGrid({ images, onZoom }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {images.map((image, index) => (
        <UltrasoundImageCard
          key={image.id}
          image={image}
          index={index}
          onZoom={onZoom}
        />
      ))}
    </div>
  );
}
