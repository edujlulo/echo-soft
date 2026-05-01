"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useClinicStore } from "@/context/activeClinicStore";
import {
  uploadClinicImage,
  getClinicImageWithSignedUrl,
} from "@/lib/queries/clinicImage";
import { compressImageForClinicUpload } from "@/lib/images/compressImage";

export function useClinicImage() {
  const { activeClinic } = useClinicStore();

  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!activeClinic) return;

    async function fetchImage() {
      setLoading(true);
      const url = await getClinicImageWithSignedUrl(activeClinic!.clinic_id);
      setImage(url);
      setLoading(false);
    }

    fetchImage();
  }, [activeClinic]);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!activeClinic || !event.target.files?.length) return;

    const file = event.target.files[0];
    setLoading(true);

    try {
      const compressedFile = await compressImageForClinicUpload(file);

      const url = await uploadClinicImage(
        activeClinic.clinic_id,
        compressedFile
      );

      if (url) {
        setImage(url + "?ts=" + Date.now());
      }
    } catch (error) {
      console.error("Clinic image upload error:", error);
    } finally {
      setLoading(false);
    }
  }

  return { image, loading, handleUpload };
}
