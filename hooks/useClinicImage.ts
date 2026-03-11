"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useClinicStore } from "@/context/activeClinicStore";
import {
  uploadClinicImage,
  getClinicImageWithSignedUrl,
} from "@/lib/queries/clinicImage";

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

    const url = await uploadClinicImage(activeClinic.clinic_id, file);

    if (url) setImage(url);

    setLoading(false);
  }

  return { image, loading, handleUpload };
}
