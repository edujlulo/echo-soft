import { useMemo } from "react";
import PhotoAlbum from "react-photo-album";

export default function UltrasoundImagesContent() {
  const images = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      // src: "/images/blank-petimage.jpg",
      src: `https://picsum.photos/seed/${i + 1}/300/300`,
      width: 1,
      height: 1,
    }));
  }, []);

  return (
    <div className="w-full max-w-full">
      <PhotoAlbum layout="columns" photos={images} columns={4} spacing={8} />
    </div>
  );
}
