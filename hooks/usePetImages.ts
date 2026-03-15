"use client";

import { useEffect, ChangeEvent } from "react";
import { useSelectedPetStore } from "@/context/selectedPetStore";
import {
  useSelectedPetImageStore,
  PetImages,
  PetImageType,
} from "@/context/selectedPetImageStore";

import { getPetImages, uploadPetImage } from "@/lib/queries/petImages";
import { usePetFetcher } from "./usePetFetcher";
import { emptyPet } from "@/context/selectedPetStore";

export function usePetImages() {
  const { selectedPet } = useSelectedPetStore();
  const { images, loading, setImages, setLoading } = useSelectedPetImageStore();

  const { refreshPets } = usePetFetcher();

  // =========================
  // FETCH IMAGE
  // =========================
  useEffect(() => {
    if (!selectedPet) return;

    // Si es emptyPet, ponemos la foto de "blank"
    if (JSON.stringify(selectedPet) === JSON.stringify(emptyPet)) {
      setImages({ profile: "/images/blank-petimage.jpg" });
      setLoading({ profile: false });
      return; // no buscamos nada más
    }

    // Si la imagen ya está en images, no la sobreescribimos
    if (
      selectedPet.image_path &&
      images.profile?.includes(selectedPet.image_path)
    ) {
      setLoading({ profile: false });
      return;
    }

    if (typeof selectedPet.pet_id !== "string") return;

    const petId = selectedPet.pet_id;
    const imagePath = selectedPet.image_path ?? null;

    async function fetchImage() {
      const data: PetImages = await getPetImages(petId, imagePath);

      setImages(data);
      setLoading({ profile: false });
    }

    fetchImage();
  }, [selectedPet, setImages, setLoading]);

  // =========================
  // UPLOAD IMAGE
  // =========================
  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>,
    type: PetImageType
  ) {
    if (!selectedPet || typeof selectedPet.pet_id !== "string") return;

    const petId = selectedPet.pet_id;

    if (!event.target.files?.length) return;

    const file = event.target.files[0];

    setLoading({ [type]: true });

    const url = await uploadPetImage(petId, file, type);

    if (!url) {
      setLoading({ [type]: false });
      return;
    }

    const finalUrl = url + "?ts=" + Date.now();

    // 1️⃣ Actualizamos la imagen en el estado local de selectedPet
    setImages({
      ...images, // tu estado actual
      [type]: finalUrl,
    });

    // Actualizamos selectedPet
    // useSelectedPetStore.getState().setSelectedPet({
    //   ...selectedPet,
    //   image_path: finalUrl,
    // });

    setLoading({ [type]: false });

    // 3️⃣ Refrescamos la lista global de pets
    // SOLO actualizar selectedPet después de refreshPets(), así ya no se pisa
    refreshPets().then(() => {
      const currentPet = useSelectedPetStore.getState().selectedPet;
      if (currentPet) {
        useSelectedPetStore.getState().setSelectedPet({
          ...currentPet,
          image_path: finalUrl,
        });
      }
    });
  }

  return {
    images,
    loading,
    handleUpload,
  };
}
