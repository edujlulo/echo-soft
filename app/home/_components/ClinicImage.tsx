"use client";

import Button from "@/components/Button";
import { useClinicImage } from "@/hooks/useClinicImage";
import { useRef } from "react";

export default function ClinicImage() {
  const { image, loading, handleUpload } = useClinicImage();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-[300px] flex flex-col items-center justify-start mt-1">
      <div className="w-[300px] h-[200px] flex items-center justify-center bg-transparent rounded">
        {loading ? (
          <div className="flex flex-col items-center gap-1 text-gray-500 animate-pulse">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Cargando imagen...</span>
          </div>
        ) : (
          <img
            src={image || "/images/blank-clinicimage.jpg"}
            alt="Clinic logo"
            className="w-[300px] h-[200px] object-contain cursor-pointer"
            onClick={() => inputRef.current?.click()}
          />
        )}
      </div>

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleUpload(e)}
      />
    </div>
  );
}
