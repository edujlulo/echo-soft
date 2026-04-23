"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import UltrasoundImagesGrid from "./UltrasoundImagesGrid";
import { useUltrasoundImages } from "@/hooks/useUltrasoundImages";
import { useConsultationStore } from "@/context/consultationStore";
import { useUltrasoundUploadManager } from "@/components/providers/UltrasoundUploadManagerProvider";
import { MAX_ULTRASOUND_IMAGES_PER_CONSULTATION } from "@/lib/queries/ultrasoundImages";

import "yet-another-react-lightbox/styles.css";
import UltrasoundImagesActions from "./UltrasoundImagesActions";

function LoadingState() {
  return (
    <div className="h-full min-h-[320px] w-full flex flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700" />
      <div className="text-center">
        <p className="text-base font-medium text-gray-700">
          Cargando imágenes...
        </p>
        <p className="text-sm text-gray-500">
          Estamos preparando la galería de esta consulta.
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[320px] w-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 text-center">
      <p className="text-base font-medium text-gray-700">
        No hay imágenes en esta consulta
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Haz clic en “Copiar imágenes desde la carpeta” para agregar imágenes de
        ecografía.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-full min-h-[320px] w-full flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-base font-medium text-red-600">
        No se pudieron cargar las imágenes
      </p>

      <p className="text-sm text-gray-500 max-w-md">
        Ocurrió un problema al obtener las imágenes de esta consulta. Intenta
        nuevamente.
      </p>

      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition"
      >
        Reintentar
      </button>
    </div>
  );
}

function UploadProgressState({
  percentage,
  currentFileName,
  currentFileIndex,
  totalFiles,
}: {
  percentage: number;
  currentFileName: string | null;
  currentFileIndex: number;
  totalFiles: number;
}) {
  return (
    <div className="h-full min-h-[320px] w-full flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-xl border border-gray-300 bg-white p-10 shadow-sm">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800">
            Subiendo imágenes...
          </p>

          <p className="mt-3 text-base text-gray-500">
            Archivo {currentFileIndex} de {totalFiles}
          </p>

          <p className="mt-2 text-sm text-gray-500 break-all">
            {currentFileName ?? "Preparando archivo..."}
          </p>
        </div>

        <div className="mt-8 h-8 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-4 text-center text-3xl font-bold text-blue-700">
          {percentage}%
        </p>
      </div>
    </div>
  );
}

export default function UltrasoundImagesContent() {
  const [index, setIndex] = useState(-1);

  const { state: uploadManagerState } = useUltrasoundUploadManager();
  const lastCompletedBatch = uploadManagerState.lastCompletedBatch;
  const handledCompletedBatchIdRef = useRef<string | null>(
    lastCompletedBatch?.id ?? null,
  );

  const activeUploadItem =
    [...uploadManagerState.items]
      .reverse()
      .find(
        (item) => item.status === "queued" || item.status === "uploading",
      ) ?? null;

  const consultationId = useConsultationStore(
    (s) => s.selectedConsultation?.consultation_id,
  );

  const {
    images,
    isLoadingImages,
    fetchUltrasoundImages,
    fetchError,
    deleteAllUltrasoundImages,
    deleteUltrasoundImage,
    isDeletingAllImages,
    deletingImageId,
  } = useUltrasoundImages();

  const loadImages = useCallback(async () => {
    if (!consultationId) return;
    try {
      await fetchUltrasoundImages(consultationId);
    } catch {
      // handled by state
    }
  }, [consultationId, fetchUltrasoundImages]);

  useEffect(() => {
    if (!consultationId) return;
    void loadImages();
  }, [consultationId, loadImages]);

  useEffect(() => {
    if (!consultationId || !lastCompletedBatch) return;
    if (lastCompletedBatch.consultationId !== consultationId) return;
    if (lastCompletedBatch.id === handledCompletedBatchIdRef.current) return;

    handledCompletedBatchIdRef.current = lastCompletedBatch.id;
    void loadImages();
  }, [consultationId, lastCompletedBatch, loadImages]);

  useEffect(() => {
    if (!fetchError) return;

    console.warn("Ultrasound images fetch error:", fetchError);
  }, [fetchError]);

  function openLightbox(imageIndex: number) {
    setIndex(imageIndex);
  }

  return (
    <div className="h-full min-h-0 flex flex-row gap-4">
      {/* === LEFT === */}
      <div className="w-[1150px] h-full overflow-y-auto">
        {activeUploadItem ? (
          <UploadProgressState
            percentage={activeUploadItem.percentage}
            currentFileName={activeUploadItem.fileName}
            currentFileIndex={activeUploadItem.batchIndex}
            totalFiles={activeUploadItem.batchTotal}
          />
        ) : isLoadingImages ? (
          <LoadingState />
        ) : fetchError ? (
          <ErrorState onRetry={loadImages} />
        ) : images.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <UltrasoundImagesGrid
              images={images}
              onZoom={openLightbox}
              onDeleteComplete={loadImages}
              deleteUltrasoundImage={deleteUltrasoundImage}
              deletingImageId={deletingImageId}
            />

            <Lightbox
              open={index >= 0}
              close={() => setIndex(-1)}
              index={index}
              slides={images.map((image) => ({
                src: image.src,
              }))}
              plugins={[Zoom]}
            />
          </>
        )}
      </div>

      {/* === RIGHT === */}
      <div className="flex flex-col">
        <div className="w-full flex justify-start">
          <p className="pl-4 pt-4 text-lg text-gray-600">
            {images.length} / {MAX_ULTRASOUND_IMAGES_PER_CONSULTATION} imágenes
          </p>
        </div>
        <div className="h-full pl-4 pb-18 flex">
          <UltrasoundImagesActions
            onUploadComplete={loadImages}
            deleteAllUltrasoundImages={deleteAllUltrasoundImages}
            isDeletingAllImages={isDeletingAllImages}
            currentImageCount={images.length}
          />
        </div>
      </div>
    </div>
  );
}
