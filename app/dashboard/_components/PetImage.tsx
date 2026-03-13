"use client";

import Button from "@/components/Button";
// import { useRef } from "react";

export default function PetImage() {
  // const InputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1 justify-center items-center">
      <div className="flex items-center justify-center bg-transparent rounded border border-gray-400 ">
        {/* {loading.profile ? (
          <div className="flex flex-col items-center gap-1 text-gray-500 animate-pulse">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Cargando imagen...</span>
          </div>
        ) : (
          <img
            // src={images.profile || "/images/blank-vetimages.jpg"}
            src="/images/blank-petimage.jpg"
            alt="Profile photo"
            className="w-[140px] h-[120px] object-contain"
          />
        )} */}

        <img
          // src={images.profile || "/images/blank-vetimages.jpg"}
          src="/images/blank-petimage.jpg"
          alt="Profile photo"
          className="w-[148px] h-[160px] rounded object-contain"
        />
      </div>

      <div className="my-2 text-sm flex flex-row gap-0.5">
        {/* <Button onClick={() => InputRef.current?.click()}>Archivo</Button> */}
        <Button>Archivo</Button>

        <input
          type="file"
          // ref={InputRef}
          className="hidden"
          accept="image/*"
          // onChange={(e) => handleUpload(e, "profile")}
        />

        <Button>Zoom</Button>
        <Button>X</Button>
      </div>
    </div>
  );
}
