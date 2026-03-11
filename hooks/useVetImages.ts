"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useActiveVetStore } from "@/context/activeVetStore";
import {
  uploadVetImage,
  VetImageType,
  getVetImagesWithSignedUrls,
  SignedVetImages,
} from "@/lib/queries/vetImages";

export function useVetImages() {
  const { activeVet } = useActiveVetStore();

  const [loading, setLoading] = useState({ profile: true, signature: true });
  const [images, setImages] = useState<SignedVetImages>({
    profile: null,
    signature: null,
    other: [],
  });

  useEffect(() => {
    if (!activeVet) return;

    console.log("Active vet ID:", activeVet.vet_id);

    async function fetchImages() {
      setLoading({ profile: true, signature: true });
      const signedImages = await getVetImagesWithSignedUrls(activeVet!.vet_id);
      setImages(signedImages);
      setLoading({ profile: false, signature: false });
    }

    fetchImages();
  }, [activeVet]);

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>,
    type: VetImageType,
  ) {
    if (!activeVet || !event.target.files?.length) return;

    const file = event.target.files[0];

    // <-- 1. Mostrar cargando
    setLoading((prev) => ({ ...prev, [type]: true }));

    const url = await uploadVetImage(activeVet.vet_id, file, type);

    if (!url) {
      // <-- 2. En caso de error, dejar de mostrar cargando
      setLoading((prev) => ({ ...prev, [type]: false }));
      return;
    }

    // <-- 3. Actualizar imagen
    setImages((prev) => ({ ...prev, [type]: url }));

    // <-- 4. Ya terminó de cargar
    setLoading((prev) => ({ ...prev, [type]: false }));
  }

  return { images, loading, handleUpload };
}
