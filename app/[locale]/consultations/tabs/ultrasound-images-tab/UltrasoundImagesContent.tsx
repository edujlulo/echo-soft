"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import UltrasoundImagesGrid from "./UltrasoundImagesGrid";
import { useUltrasoundImages } from "@/hooks/useUltrasoundImages";
import { useConsultationStore } from "@/context/consultationStore";
import { useUltrasoundUploadManager } from "@/components/providers/UltrasoundUploadManagerProvider";
import { MAX_ULTRASOUND_IMAGES_PER_CONSULTATION } from "@/lib/queries/ultrasoundImages";
import AppDialog from "@/components/AppDialog";
import Button from "@/components/Button";

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
  isCancelling,
  onCancelClick,
}: {
  percentage: number;
  currentFileName: string | null;
  currentFileIndex: number;
  totalFiles: number;
  isCancelling: boolean;
  onCancelClick: () => void;
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

        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            onClick={onCancelClick}
            disabled={isCancelling}
            className="w-52"
          >
            {isCancelling ? "Cancelando subida..." : "Cancelar subida"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function getSelectedImagesLabel(count: number) {
  if (count === 1) {
    return "1 imagen seleccionada";
  }

  return `${count} imágenes seleccionadas`;
}

export default function UltrasoundImagesContent() {
  const [index, setIndex] = useState(-1);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancellingUpload, setIsCancellingUpload] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isNoSelectionDialogOpen, setIsNoSelectionDialogOpen] = useState(false);
  const [isDeleteSelectedDialogOpen, setIsDeleteSelectedDialogOpen] =
    useState(false);
  const [isSelectionToolbarPinned, setIsSelectionToolbarPinned] =
    useState(false);

  const { manager: uploadManager, state: uploadManagerState } =
    useUltrasoundUploadManager();
  const lastCompletedBatch = uploadManagerState.lastCompletedBatch;
  const handledCompletedBatchIdRef = useRef<string | null>(
    lastCompletedBatch?.id ?? null,
  );
  const activeBatch = uploadManagerState.activeBatch;

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
    deleteSelectedUltrasoundImages,
    deleteUltrasoundImage,
    isDeletingAllImages,
    isDeletingSelectedImages,
    deletingImageId,
    deletingImageIds,
    error,
    clearUltrasoundImagesError,
  } = useUltrasoundImages();

  const selectedImageCount = selectedImageIds.size;
  const shouldShowSelectionToolbar =
    selectedImageCount > 0 || isSelectionToolbarPinned;
  const visibleImageIds = useMemo(
    () => images.map((image) => image.id),
    [images],
  );
  const isSelectionBusy =
    isDeletingAllImages || isDeletingSelectedImages || deletingImageId !== null;

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

  useEffect(() => {
    setSelectedImageIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(
        [...currentSelectedIds].filter((imageId) =>
          visibleImageIds.includes(imageId),
        ),
      );

      if (nextSelectedIds.size === currentSelectedIds.size) {
        return currentSelectedIds;
      }

      return nextSelectedIds;
    });
  }, [visibleImageIds]);

  function openLightbox(imageIndex: number) {
    setIndex(imageIndex);
  }

  function handleToggleSelection(imageId: string) {
    setSelectedImageIds((currentSelectedIds) => {
      const nextSelectedIds = new Set(currentSelectedIds);

      if (nextSelectedIds.has(imageId)) {
        nextSelectedIds.delete(imageId);
      } else {
        nextSelectedIds.add(imageId);
        setIsSelectionToolbarPinned(true);
      }

      return nextSelectedIds;
    });
  }

  function handleSelectAll() {
    setSelectedImageIds(new Set(visibleImageIds));
  }

  function handleDeselectAll() {
    setSelectedImageIds(new Set());
  }

  function handleOpenDeleteSelectedDialog() {
    setIsSelectionToolbarPinned(true);

    if (selectedImageCount === 0) {
      setIsNoSelectionDialogOpen(true);
      return;
    }

    clearUltrasoundImagesError();
    setIsDeleteSelectedDialogOpen(true);
  }

  async function handleDeleteSelectedImages() {
    const imageIdsToDelete = [...selectedImageIds];

    if (imageIdsToDelete.length === 0) {
      setIsDeleteSelectedDialogOpen(false);
      return;
    }

    try {
      await deleteSelectedUltrasoundImages(imageIdsToDelete);
      setSelectedImageIds(new Set());
      setIsDeleteSelectedDialogOpen(false);
      await loadImages();
    } catch (deleteError) {
      console.error("Delete selected ultrasound images error:", deleteError);
    }
  }

  async function handleCancelUpload(removeUploaded: boolean) {
    if (!activeBatch) return;

    try {
      setIsCancellingUpload(true);
      await uploadManager.cancelActiveBatch({ removeUploaded });
      await loadImages();
      setIsCancelDialogOpen(false);
    } catch (cancelError) {
      console.error("Cancel ultrasound upload error:", cancelError);
    } finally {
      setIsCancellingUpload(false);
    }
  }

  return (
    <div className="h-full min-h-0 flex flex-row gap-4">
      <div className="w-[1150px] h-full overflow-y-auto">
        {activeUploadItem ? (
          <UploadProgressState
            percentage={activeUploadItem.percentage}
            currentFileName={activeUploadItem.fileName}
            currentFileIndex={activeUploadItem.batchIndex}
            totalFiles={activeUploadItem.batchTotal}
            isCancelling={
              isCancellingUpload || activeBatch?.isCancelling === true
            }
            onCancelClick={() => setIsCancelDialogOpen(true)}
          />
        ) : isLoadingImages ? (
          <LoadingState />
        ) : fetchError ? (
          <ErrorState onRetry={loadImages} />
        ) : images.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {shouldShowSelectionToolbar ? (
              <div className="mb-3 flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm font-medium text-gray-600">
                  {getSelectedImagesLabel(selectedImageCount)}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    disabled={images.length === 0 || isSelectionBusy}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Seleccionar todas
                  </button>

                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    disabled={selectedImageCount === 0 || isSelectionBusy}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Deseleccionar todas
                  </button>
                </div>
              </div>
            ) : null}

            <UltrasoundImagesGrid
              images={images}
              onZoom={openLightbox}
              selectedImageIds={selectedImageIds}
              onToggleSelection={handleToggleSelection}
              isSelectionDisabled={isSelectionBusy}
              deletingImageIds={deletingImageIds}
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

      <AppDialog
        widthClassName="w-[700px]"
        isOpen={isCancelDialogOpen}
        onClose={() => {
          if (isCancellingUpload) return;
          setIsCancelDialogOpen(false);
        }}
        navbarTitle="Cancelar subida"
        title="¿Cancelar subida de imágenes?"
        description={
          <p>
            Ya se han subido {activeBatch?.uploadedCount ?? 0} de{" "}
            {activeBatch?.totalFiles ?? 0} imágenes. ¿Qué deseas hacer con las
            imágenes subidas hasta ahora?
          </p>
        }
        showCancelButton={false}
        disableClose={isCancellingUpload}
        footer={
          <>
            <Button
              type="button"
              onClick={() => void handleCancelUpload(false)}
              disabled={isCancellingUpload}
              className="w-56"
            >
              {isCancellingUpload
                ? "Cancelando subida..."
                : "Mantener imágenes subidas"}
            </Button>
            <Button
              type="button"
              onClick={() => void handleCancelUpload(true)}
              disabled={isCancellingUpload}
              className="w-56 bg-red-600 border-red-700 hover:bg-red-700"
            >
              {isCancellingUpload
                ? "Eliminando imágenes..."
                : "Eliminar imágenes subidas"}
            </Button>
            <Button
              type="button"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCancellingUpload}
              className="w-32"
            >
              Volver
            </Button>
          </>
        }
      />

      <AppDialog
        isOpen={isNoSelectionDialogOpen}
        onClose={() => setIsNoSelectionDialogOpen(false)}
        navbarTitle="Imágenes seleccionadas"
        title="No hay imágenes seleccionadas"
        description={
          <p>
            Selecciona al menos una imagen antes de intentar borrar imágenes
            seleccionadas.
          </p>
        }
        confirmLabel="Entendido"
        showCancelButton={false}
        onConfirm={() => setIsNoSelectionDialogOpen(false)}
      />

      <AppDialog
        isOpen={isDeleteSelectedDialogOpen}
        onClose={() => {
          if (isDeletingSelectedImages) return;
          clearUltrasoundImagesError();
          setIsDeleteSelectedDialogOpen(false);
        }}
        navbarTitle="Confirmar eliminación"
        title="¿Borrar imágenes seleccionadas?"
        description={
          <>
            <p>
              {selectedImageCount === 1
                ? "Vas a borrar 1 imagen seleccionada. Esta acción no se puede deshacer."
                : `Vas a borrar ${selectedImageCount} imágenes seleccionadas. Esta acción no se puede deshacer.`}
            </p>
            {error ? (
              <p className="mt-2 font-medium text-red-700">{error}</p>
            ) : null}
          </>
        }
        confirmLabel="Borrar imágenes"
        confirmLoadingLabel="Borrando imágenes..."
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isDeletingSelectedImages}
        disableClose={isDeletingSelectedImages}
        onConfirm={handleDeleteSelectedImages}
        onCancel={() => {
          clearUltrasoundImagesError();
          setIsDeleteSelectedDialogOpen(false);
        }}
      />

      <div className="flex flex-col">
        <div className="w-full flex justify-start">
          <p className="pl-4 pt-4 text-lg text-gray-600">
            {images.length} / {MAX_ULTRASOUND_IMAGES_PER_CONSULTATION} imágenes
          </p>
        </div>
        <div className="h-full pl-4 pb-18 flex">
          <UltrasoundImagesActions
            onUploadComplete={loadImages}
            onDeleteSelectedClick={handleOpenDeleteSelectedDialog}
            deleteAllUltrasoundImages={deleteAllUltrasoundImages}
            isDeletingAllImages={isDeletingAllImages}
            isDeletingSelectedImages={isDeletingSelectedImages}
            hasImages={images.length > 0}
            selectedImageCount={selectedImageCount}
            isSelectionActionsDisabled={deletingImageId !== null}
            currentImageCount={images.length}
          />
        </div>
      </div>
    </div>
  );
}
