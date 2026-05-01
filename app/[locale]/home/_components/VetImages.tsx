"use client";

import AppDialog from "@/components/AppDialog";
import Button from "@/components/Button";
import { useVetImages } from "@/hooks/useVetImages";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import {
  isVetImageWithinSizeLimit,
  MAX_VET_IMAGE_SIZE_MB,
} from "@/lib/queries/vetImages";

export default function VetImages() {
  const t = useTranslations("VetImages");
  const { images, loading, handleUpload, handleDelete } = useVetImages();

  const profileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const [dialogMessage, setDialogMessage] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<
    "profile" | "signature" | null
  >(null);
  const [zoomImage, setZoomImage] = useState<"profile" | "signature" | null>(
    null
  );

  const profileImageSrc = images.profile || "/images/blank-vetimages.jpg";
  const signatureImageSrc = images.signature || "/images/blank-vetimages.jpg";

  const hasRealProfileImage = !!images.profile;
  const hasRealSignatureImage = !!images.signature;
  const isDeleteDialogOpen = deleteTarget !== null;
  const isDeleting =
    deleteTarget === "profile"
      ? loading.profile
      : deleteTarget === "signature"
      ? loading.signature
      : false;

  function handleOpenDeleteConfirmation(type: "profile" | "signature") {
    const hasImage =
      type === "profile" ? hasRealProfileImage : hasRealSignatureImage;

    if (!hasImage) {
      setDialogMessage(
        type === "profile" ? t("noProfileToDelete") : t("noSignatureToDelete")
      );
      setIsAlertDialogOpen(true);
      return;
    }

    setDeleteTarget(type);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      await handleDelete(deleteTarget);
      setDeleteTarget(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : deleteTarget === "profile"
          ? t("errorDeletingProfile")
          : t("errorDeletingSignature");

      setDeleteTarget(null);
      setDialogMessage(message);
      setIsAlertDialogOpen(true);
    }
  }

  function handleVetImageSelected(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "signature"
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!isVetImageWithinSizeLimit(file)) {
      setDialogMessage(
        t("imageSizeLimitError", {
          maxSizeMb: MAX_VET_IMAGE_SIZE_MB,
        })
      );
      setIsAlertDialogOpen(true);
      event.target.value = "";
      return;
    }

    handleUpload(event, type);
  }

  return (
    <div className="w-[200px] flex flex-col items-center justify-start mt-1">
      {/* PROFILE PHOTO */}
      <p className="font-bold">{t("profilePhoto")}</p>

      <div className="w-[140px] h-[120px] flex items-center justify-center bg-transparent rounded">
        {loading.profile ? (
          <div className="flex flex-col items-center gap-1 text-gray-500 animate-pulse">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">{t("loadingImage")}</span>
          </div>
        ) : (
          <img
            src={profileImageSrc}
            alt="Profile photo"
            className="w-[140px] h-[120px] object-contain"
          />
        )}
      </div>

      <div className="my-2 space-x-1 text-sm">
        <Button onClick={() => profileInputRef.current?.click()}>
          {t("file")}
        </Button>

        <input
          type="file"
          ref={profileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleVetImageSelected(e, "profile")}
        />

        <Button
          type="button"
          onClick={() => setZoomImage("profile")}
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
          {t("zoom")}
        </Button>
        <Button
          type="button"
          onClick={() => handleOpenDeleteConfirmation("profile")}
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
          {loading.profile ? "..." : "X"}
        </Button>
      </div>

      {/* SIGNATURE */}
      <p className="font-bold text-sm">{t("signature")}</p>

      <div className="w-[120px] h-[100px] flex items-center justify-center bg-transparent rounded">
        {loading.signature ? (
          <div className="flex flex-col items-center gap-1 text-gray-500 animate-pulse">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">{t("loadingImage")}</span>
          </div>
        ) : (
          <img
            src={signatureImageSrc}
            alt="Signature photo"
            className="w-[120px] h-[100px] object-contain"
          />
        )}
      </div>

      <div className="my-2 space-x-1 text-sm">
        <Button onClick={() => signatureInputRef.current?.click()}>
          {t("file")}
        </Button>

        <input
          type="file"
          ref={signatureInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleVetImageSelected(e, "signature")}
        />

        <Button
          type="button"
          onClick={() => setZoomImage("signature")}
          disabled={!hasRealSignatureImage || loading.signature}
          className={
            !hasRealSignatureImage || loading.signature
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
          {t("zoom")}
        </Button>
        <Button
          type="button"
          onClick={() => handleOpenDeleteConfirmation("signature")}
          disabled={!hasRealSignatureImage || loading.signature}
          className={
            !hasRealSignatureImage || loading.signature
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
          {loading.signature ? "..." : "X"}
        </Button>
      </div>

      <Lightbox
        open={zoomImage !== null}
        close={() => setZoomImage(null)}
        index={0}
        slides={[
          {
            src: zoomImage === "profile" ? profileImageSrc : signatureImageSrc,
          },
        ]}
        plugins={[Zoom]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />

      <AppDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteTarget(null)}
        navbarTitle={t("confirmDeleteTitle")}
        title={t("confirmDeleteQuestion")}
        description={
          deleteTarget === "profile"
            ? t("deleteProfileDescription")
            : t("deleteSignatureDescription")
        }
        showCloseButton
        showFooter
        showCancelButton
        cancelLabel={t("cancel")}
        confirmLabel={t("confirmDelete")}
        confirmLoadingLabel={t("deletingImage")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        disableClose={isDeleting}
        widthClassName="w-[420px]"
      />

      <AppDialog
        isOpen={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
        navbarTitle={t("notice")}
        description={dialogMessage}
        showCloseButton
        showFooter
        showCancelButton={false}
        confirmLabel={t("accept")}
        onConfirm={() => setIsAlertDialogOpen(false)}
        widthClassName="w-[420px]"
      />
    </div>
  );
}
