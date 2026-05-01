"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useActiveVetStore } from "@/context/activeVetStore";
import {
  uploadVetImage,
  VetImageType,
  getVetImagesWithSignedUrls,
  SignedVetImages,
  deleteVetImage,
} from "@/lib/queries/vetImages";
import { compressImageForVetUpload } from "@/lib/images/compressImage";

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
    type: VetImageType
  ) {
    if (!activeVet || !event.target.files?.length) return;

    const file = event.target.files[0];

    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const compressedFile = await compressImageForVetUpload(file);

      const url = await uploadVetImage(activeVet.vet_id, compressedFile, type);

      if (!url) {
        setLoading((prev) => ({ ...prev, [type]: false }));
        return;
      }

      setImages((prev) => ({
        ...prev,
        [type]: url + "?ts=" + Date.now(),
      }));
    } catch (error) {
      console.error("Vet image upload error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  }

  async function handleDelete(
    type: Extract<VetImageType, "profile" | "signature">
  ) {
    if (!activeVet) return;

    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      await deleteVetImage(activeVet.vet_id, type);

      setImages((prev) => ({
        ...prev,
        [type]: null,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  }

  return { images, loading, handleUpload, handleDelete };
}
