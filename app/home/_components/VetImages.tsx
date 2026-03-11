import Button from "@/components/Button";
import { useVetImages } from "@/hooks/useVetImages";
import { useRef } from "react";

export default function VetImages() {
  const { images, loading, handleUpload } = useVetImages();

  const profileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-[200px] flex flex-col items-center justify-start mt-1">
      {/* PROFILE PHOTO */}
      <p className="font-bold">Foto de perfil</p>

      <div className="w-[140px] h-[120px] flex items-center justify-center bg-transparent rounded">
        {loading.profile ? (
          <div className="flex flex-col items-center gap-1 text-gray-500 animate-pulse">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Cargando imagen...</span>
          </div>
        ) : (
          <img
            src={images.profile || "/images/blank-vetimages.jpg"}
            alt="Profile photo"
            className="w-[140px] h-[120px] object-contain"
          />
        )}
      </div>

      <div className="my-2 space-x-1 text-sm">
        <Button onClick={() => profileInputRef.current?.click()}>
          Archivo
        </Button>

        <input
          type="file"
          ref={profileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleUpload(e, "profile")}
        />

        <Button>Zoom</Button>
        <Button>X</Button>
      </div>

      {/* SIGNATURE */}
      <p className="font-bold text-sm">Firma</p>

      <div className="w-[120px] h-[100px] flex items-center justify-center bg-transparent rounded">
        {loading.signature ? (
          <div className="flex flex-col items-center gap-1 text-gray-500 animate-pulse">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Cargando imagen...</span>
          </div>
        ) : (
          <img
            src={images.signature || "/images/blank-vetimages.jpg"}
            alt="Signature photo"
            className="w-[120px] h-[100px] object-contain"
          />
        )}
      </div>

      <div className="my-2 space-x-1 text-sm">
        <Button onClick={() => signatureInputRef.current?.click()}>
          Archivo
        </Button>

        <input
          type="file"
          ref={signatureInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleUpload(e, "signature")}
        />

        <Button>Zoom</Button>
        <Button>X</Button>
      </div>
    </div>
  );
}
