"use client";

import Button from "@/components/Button";

interface Image {
  id: number;
  src: string;
  alt: string;
}

interface Props {
  image: Image;
  index: number;
  onZoom: (index: number) => void;
}

export default function UltrasoundImageCard({ image, index, onZoom }: Props) {
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
        <Button type="button" className="flex-1" onClick={() => onZoom(index)}>
          Zoom
        </Button>

        <Button
          type="button"
          className="w-10 flex items-center justify-center"
          onClick={() => {}}
        >
          X
        </Button>
      </div>
    </div>
  );
}
