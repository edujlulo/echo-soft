"use client";

import { useMemo, useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "react-photo-album/styles.css";
import "yet-another-react-lightbox/styles.css";

export default function UltrasoundImagesContent() {
  const [index, setIndex] = useState(-1);

  const images = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      src: `https://picsum.photos/seed/${i + 1}/800/800`,
      width: 1,
      height: 1,
    }));
  }, []);

  return (
    <div className="w-full">
      <PhotoAlbum
        layout="rows"
        photos={images}
        spacing={8}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images}
        plugins={[Zoom]}
      />
    </div>
  );
}
