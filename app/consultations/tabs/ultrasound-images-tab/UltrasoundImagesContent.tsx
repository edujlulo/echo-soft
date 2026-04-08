"use client";

import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import UltrasoundImagesGrid from "./UltrasoundImagesGrid";

import "yet-another-react-lightbox/styles.css";
import UltrasoundImagesActions from "./UltrasoundImagesActions";

export default function UltrasoundImagesContent() {
  const [index, setIndex] = useState(-1);

  const images = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      src: `https://picsum.photos/seed/${i + 1}/800/800`,
      alt: `Ultrasound image ${i + 1}`,
    }));
  }, []);

  function openLightbox(imageIndex: number) {
    setIndex(imageIndex);
  }

  return (
    <div className="h-full min-h-0 flex flex-row gap-4">
      {/* === LEFT === */}
      <div className="w-[1150px] h-full overflow-y-auto">
        <UltrasoundImagesGrid images={images} onZoom={openLightbox} />

        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          index={index}
          slides={images.map((image) => ({
            src: image.src,
          }))}
          plugins={[Zoom]}
        />
      </div>

      {/* === RIGHT === */}
      <div className="flex flex-col">
        <div className="w-full flex justify-start">
          <p className="pl-4 pt-4 text-lg text-gray-600">
            {images.length} imágenes
          </p>
        </div>
        <div className="h-full pb-18 flex">
          <UltrasoundImagesActions />
        </div>
      </div>
    </div>
  );
}
