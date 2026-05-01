"use client";

import Button from "@/components/Button";
import { useClinicImage } from "@/hooks/useClinicImage";
import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent } from "react";
import AppDialog from "@/components/AppDialog";
import {
  isClinicImageWithinSizeLimit,
  MAX_CLINIC_IMAGE_SIZE_MB,
} from "@/lib/queries/clinicImage";

export default function ClinicImage() {
  const t = useTranslations("ClinicImage");
  const { image, loading, handleUpload } = useClinicImage();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isSizeLimitDialogOpen, setIsSizeLimitDialogOpen] = useState(false);

  function handleClinicImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!isClinicImageWithinSizeLimit(file)) {
      setIsSizeLimitDialogOpen(true);
      event.target.value = "";
      return;
    }

    handleUpload(event);
  }

  return (
    <div className="w-[300px] flex flex-col items-center justify-start mt-1">
      <div className="w-[300px] h-[200px] flex items-center justify-center bg-transparent rounded">
        {loading ? (
          <div className="flex flex-col items-center gap-1 text-gray-500 animate-pulse">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">{t("loadingImage")}</span>
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
        onChange={handleClinicImageSelected}
      />

      <AppDialog
        isOpen={isSizeLimitDialogOpen}
        onClose={() => setIsSizeLimitDialogOpen(false)}
        navbarTitle={t("imageSizeLimitTitle")}
        title={t("imageSizeLimitTitle")}
        description={
          <p>
            {t("imageSizeLimitError", {
              maxSizeMb: MAX_CLINIC_IMAGE_SIZE_MB,
            })}
          </p>
        }
        confirmLabel={t("accept")}
        showCancelButton={false}
        onConfirm={() => setIsSizeLimitDialogOpen(false)}
      />
    </div>
  );
}
