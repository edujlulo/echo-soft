"use client";

import Button from "@/components/Button";
import { useRef, useState } from "react";
import { usePetImages } from "@/hooks/usePetImages";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { emptyPet, useSelectedPetStore } from "@/context/selectedPetStore";
import AppDialog from "@/components/AppDialog";

export default function PetImage() {
  const { images, loading, handleUpload } = usePetImages();

  const selectedPet = useSelectedPetStore((s) => s.selectedPet);

  const [dialogMessage, setDialogMessage] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);

  const profileImageSrc = images.profile || "/images/blank-petimage.jpg";
  const hasRealProfileImage =
    !!images.profile && images.profile !== "/images/blank-petimage.jpg";

  return (
    <div className="flex flex-col gap-1 justify-center items-center">
      {/* ========= PET PROFILE PHOTO ========= */}
      <div className="relative w-[140px] h-[120px] flex items-center justify-center bg-transparent rounded">
        {loading.profile ? (
          <div className="flex flex-col items-center gap-1 text-blue-800 animate-pulse overlay">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Cargando imagen...</span>
          </div>
        ) : (
          <img
            src={profileImageSrc}
            alt="Pet profile photo"
            className="w-[140px] h-[120px] object-contain"
          />
        )}
      </div>

      <div className="my-2 text-sm flex flex-row gap-0.5">
        <Button
          onClick={() => {
            if (
              !selectedPet ||
              JSON.stringify(selectedPet) === JSON.stringify(emptyPet)
            ) {
              setDialogMessage("Por favor seleccione una mascota");
              setIsAlertDialogOpen(true);
              return;
            }

            profileInputRef.current?.click();
          }}
        >
          Archivo
        </Button>

        <input
          type="file"
          ref={profileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > 5 * 1024 * 1024) {
              window.alert("La imagen no puede superar los 5MB.");
              e.target.value = ""; // 🔹 Reset input aquí
              return;
            }
            handleUpload(e, "profile");
          }}
        />

        <Button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          disabled={!hasRealProfileImage || loading.profile}
          className={
            !hasRealProfileImage || loading.profile
              ? `
        bg-gray-200
        border-gray-300
        text-gray-500
        cursor-not-allowed
        hover:bg-gray-200
        hover:border-gray-300
        opacity-80
      `
              : ""
          }
        >
          Zoom
        </Button>
        <Button
          disabled
          className="
      bg-gray-200 
      border-gray-300 
      text-gray-500 
      cursor-not-allowed 
      hover:bg-gray-200 
      hover:border-gray-300
      opacity-80
    "
        >
          X
        </Button>
      </div>
      <Lightbox
        open={isZoomOpen}
        close={() => setIsZoomOpen(false)}
        index={0}
        slides={[
          {
            src: profileImageSrc,
          },
        ]}
        plugins={[Zoom]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />

      {/* ========== ALERTS DIALOG ============ */}
      <AppDialog
        isOpen={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
        navbarTitle="Aviso"
        description={dialogMessage}
        showCloseButton
        showFooter
        showCancelButton={false}
        confirmLabel="Aceptar"
        onConfirm={() => setIsAlertDialogOpen(false)}
        widthClassName="w-[420px]"
      />
    </div>
  );
}
