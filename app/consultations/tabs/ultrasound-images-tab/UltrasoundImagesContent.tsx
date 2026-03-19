import { useState } from "react";

const IMAGES_PER_PAGE = 24; // 3 filas x 8 columnas

// Fake images (simulate up to 96)
const images = Array.from({ length: 96 }, (_, i) => ({
  id: i + 1,
}));

export default function UltrasoundImagesContent() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);

  const startIndex = (page - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;

  const currentImages = images.slice(startIndex, endIndex);

  function goToPage(p: number) {
    if (p < 1) return;
    if (p > totalPages) return;
    setPage(p);
  }

  return (
    <div className="flex flex-col gap-2 w-[1400px]">
      {/* FLEX GRID FORZADO: 3 filas x 8 columnas con gap */}
      {Array.from({ length: 3 }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {currentImages.slice(rowIndex * 8, rowIndex * 8 + 8).map((img) => (
            <div
              key={img.id}
              className="bg-white border border-gray-300 flex items-center justify-center text-xs text-gray-400 aspect-square w-[150px]"
            >
              Image {img.id}
            </div>
          ))}
        </div>
      ))}

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2">
        <button
          className="px-2 py-1 border bg-white disabled:opacity-40"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
        >
          {"<"}
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;

          return (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 border ${
                p === page ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          className="px-2 py-1 border bg-white disabled:opacity-40"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
