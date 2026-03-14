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
      return; // no buscamos nada más
    }

    if (typeof selectedPet.pet_id !== "string") return;

    const petId = selectedPet.pet_id;
    const imagePath = selectedPet.image_path ?? null;

    async function fetchImage() {
      setLoading({ profile: true });

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
    type: PetImageType,
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

    setImages({ [type]: url });
    setLoading({ [type]: false });

    // Refresh pets list
    refreshPets();
  }

  return {
    images,
    loading,
    handleUpload,
  };
}
