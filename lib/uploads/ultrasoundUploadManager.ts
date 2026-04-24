"use client";

import {
  createUltrasoundImage,
  deleteUltrasoundImageFilesFromStorage,
  deleteUltrasoundImageRowsByIds,
  isSupportedImageFile,
  isUploadCancellationError,
  type UploadUltrasoundImageContext,
  type UploadProgressInfo,
} from "@/lib/queries/ultrasoundImages";

export type UploadManagerStatus =
  | "idle"
  | "queued"
  | "uploading"
  | "success"
  | "error";

export interface UploadManagerItem {
  id: string;
  fileName: string;
  consultationId: string;
  petId: string | null;
  clinicId: string | null;
  vetId: string | null;
  status: UploadManagerStatus;
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
  error: string | null;
  createdAt: number;
  batchIndex: number;
  batchTotal: number;
  onComplete?: (() => Promise<void> | void) | undefined;
}

export interface CompletedUploadBatch {
  id: string;
  consultationId: string;
  petId: string | null;
  clinicId: string | null;
  vetId: string | null;
  uploadedCount: number;
  failedCount: number;
  totalFiles: number;
  completedAt: number;
}

interface UploadedBatchImage {
  id: string;
  storagePath: string;
}

export interface ActiveUploadBatch {
  id: string;
  consultationId: string;
  petId: string | null;
  clinicId: string | null;
  vetId: string | null;
  totalFiles: number;
  uploadedCount: number;
  uploadedImages: UploadedBatchImage[];
  isCancelling: boolean;
}

export interface UploadManagerState {
  items: UploadManagerItem[];
  isVisible: boolean;
  lastCompletedBatch: CompletedUploadBatch | null;
  activeBatch: ActiveUploadBatch | null;
}

type UploadManagerListener = () => void;

export interface EnqueueUltrasoundUploadParams extends UploadUltrasoundImageContext {
  files: File[] | FileList;
  startingSortOrder?: number;
  onUploadComplete?: (() => Promise<void> | void) | undefined;
}

export interface EnqueueUltrasoundUploadFailure {
  fileName: string;
  error: string;
}

export interface EnqueueUltrasoundUploadResult {
  uploadedCount: number;
  failed: EnqueueUltrasoundUploadFailure[];
}

function normalizeFiles(files: File[] | FileList): File[] {
  return Array.isArray(files) ? files : Array.from(files);
}

class UltrasoundUploadManager {
  private state: UploadManagerState = {
    items: [],
    isVisible: false,
    lastCompletedBatch: null,
    activeBatch: null,
  };

  private listeners = new Set<UploadManagerListener>();

  private hideTimeout: number | null = null;

  private currentAbortController: AbortController | null = null;

  subscribe(listener: UploadManagerListener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): UploadManagerState {
    return this.state;
  }

  private emit() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private scheduleAutoHideIfFinished() {
    const hasActiveUploads = this.state.items.some(
      (item) => item.status === "queued" || item.status === "uploading",
    );

    if (hasActiveUploads) {
      if (this.hideTimeout !== null) {
        window.clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }

      return;
    }

    if (this.state.items.length === 0) {
      if (this.hideTimeout !== null) {
        window.clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }

      return;
    }

    if (this.hideTimeout !== null) {
      return;
    }

    this.hideTimeout = window.setTimeout(() => {
      this.hideTimeout = null;
      this.clear();
    }, 200);
  }

  private setState(
    updater: (current: UploadManagerState) => UploadManagerState,
  ) {
    const nextState = updater(this.state);

    this.state = nextState;
    this.emit();
    this.scheduleAutoHideIfFinished();
  }

  show() {
    if (this.hideTimeout !== null) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.state.isVisible) {
      return;
    }

    this.setState((current) => ({
      ...current,
      isVisible: true,
    }));
  }

  hide() {
    if (!this.state.isVisible) {
      return;
    }

    this.setState((current) => ({
      ...current,
      isVisible: false,
    }));
  }

  clear() {
    if (this.hideTimeout !== null) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.setState((current) => ({
      items: [],
      isVisible: false,
      lastCompletedBatch: current.lastCompletedBatch,
      activeBatch: current.activeBatch,
    }));
  }

  registerItem(item: Omit<UploadManagerItem, "createdAt">) {
    this.setState((current) => ({
      ...current,
      isVisible: true,
      items: [
        ...current.items,
        {
          ...item,
          createdAt: Date.now(),
        },
      ],
    }));
  }

  updateItem(
    id: string,
    updates: Partial<Omit<UploadManagerItem, "id" | "createdAt">>,
  ) {
    this.setState((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    }));
  }

  removeItem(id: string) {
    this.setState((current) => {
      const nextItems = current.items.filter((item) => item.id !== id);

      return {
        items: nextItems,
        isVisible: nextItems.length > 0 ? current.isVisible : false,
        lastCompletedBatch: current.lastCompletedBatch,
        activeBatch: current.activeBatch,
      };
    });
  }

  private completeBatch(batch: CompletedUploadBatch) {
    this.setState((current) => ({
      ...current,
      lastCompletedBatch: batch,
      activeBatch:
        current.activeBatch?.id === batch.id ? null : current.activeBatch,
    }));
  }

  private setActiveBatch(batch: ActiveUploadBatch | null) {
    this.setState((current) => ({
      ...current,
      activeBatch: batch,
    }));
  }

  private updateActiveBatch(
    updater: (batch: ActiveUploadBatch) => ActiveUploadBatch,
  ) {
    this.setState((current) => ({
      ...current,
      activeBatch: current.activeBatch ? updater(current.activeBatch) : null,
    }));
  }

  async cancelActiveBatch(options?: { removeUploaded?: boolean }) {
    const activeBatch = this.state.activeBatch;

    if (!activeBatch) {
      return {
        uploadedCount: 0,
        removedCount: 0,
      };
    }

    if (!activeBatch.isCancelling) {
      this.updateActiveBatch((batch) => ({
        ...batch,
        isCancelling: true,
      }));
    }

    this.currentAbortController?.abort();

    const queuedItemIds = this.state.items
      .filter(
        (item) =>
          item.consultationId === activeBatch.consultationId &&
          item.status === "queued",
      )
      .map((item) => item.id);

    for (const itemId of queuedItemIds) {
      this.updateItem(itemId, {
        status: "error",
        error: "Upload cancelled.",
      });
    }

    const uploadedImages = [...activeBatch.uploadedImages];
    const uploadedCount = uploadedImages.length;
    let removedCount = 0;

    if (options?.removeUploaded && uploadedImages.length > 0) {
      await deleteUltrasoundImageFilesFromStorage(
        uploadedImages.map((image) => image.storagePath),
      );
      await deleteUltrasoundImageRowsByIds(
        uploadedImages.map((image) => image.id),
      );
      removedCount = uploadedImages.length;
    }

    this.setState((current) => ({
      ...current,
      activeBatch:
        current.activeBatch?.id === activeBatch.id ? null : current.activeBatch,
    }));

    return {
      uploadedCount,
      removedCount,
    };
  }

  async enqueueUltrasoundUploads(
    params: EnqueueUltrasoundUploadParams,
  ): Promise<EnqueueUltrasoundUploadResult> {
    const {
      files,
      startingSortOrder = 0,
      clinicId,
      vetId,
      petId,
      consultationId,
      source,
      notes,
      metadata,
      onUploadComplete,
    } = params;

    const normalizedFiles = normalizeFiles(files);
    const batchId = crypto.randomUUID();

    if (normalizedFiles.length === 0) {
      throw new Error("No files were selected.");
    }

    const failed: EnqueueUltrasoundUploadFailure[] = [];
    let uploadedCount = 0;

    const totalBytes = normalizedFiles.reduce(
      (sum, file) => sum + (file.size ?? 0),
      0,
    );

    let uploadedBytesSoFar = 0;
    this.setActiveBatch({
      id: batchId,
      consultationId,
      petId,
      clinicId,
      vetId,
      totalFiles: normalizedFiles.length,
      uploadedCount: 0,
      uploadedImages: [],
      isCancelling: false,
    });

    try {
      for (const [index, file] of normalizedFiles.entries()) {
        if (this.state.activeBatch?.isCancelling) {
          break;
        }

        if (!isSupportedImageFile(file)) {
          failed.push({
            fileName: file.name,
            error: "Unsupported file type. Only image files are allowed.",
          });
          continue;
        }

        const uploadId = crypto.randomUUID();

        this.registerItem({
          id: uploadId,
          fileName: file.name,
          consultationId,
          petId,
          clinicId,
          vetId,
          status: "queued",
          percentage:
            totalBytes > 0
              ? Math.round((uploadedBytesSoFar / totalBytes) * 100)
              : 0,
          uploadedBytes: uploadedBytesSoFar,
          totalBytes,
          error: null,
          batchIndex: index + 1,
          batchTotal: normalizedFiles.length,
          onComplete: undefined,
        });

        try {
          this.updateItem(uploadId, {
            status: "uploading",
          });

          const abortController = new AbortController();
          this.currentAbortController = abortController;

          const insertedRow = await createUltrasoundImage(
            file,
            {
              clinicId,
              vetId,
              petId,
              consultationId,
              source,
              notes,
              sortOrder: startingSortOrder + index,
              metadata,
            },
            ({ bytesUploaded }: UploadProgressInfo) => {
              const totalUploadedBytes = uploadedBytesSoFar + bytesUploaded;

              this.updateItem(uploadId, {
                status: "uploading",
                uploadedBytes: totalUploadedBytes,
                totalBytes,
                percentage:
                  totalBytes > 0
                    ? Math.min(
                        100,
                        Math.round((totalUploadedBytes / totalBytes) * 100),
                      )
                    : 0,
              });
            },
            abortController.signal,
          );

          uploadedBytesSoFar += file.size ?? 0;
          uploadedCount += 1;

          this.updateActiveBatch((batch) => ({
            ...batch,
            uploadedCount: batch.uploadedCount + 1,
            uploadedImages: [
              ...batch.uploadedImages,
              {
                id: insertedRow.id,
                storagePath: insertedRow.storage_path,
              },
            ],
          }));

          await this.completeItem(uploadId);
        } catch (error) {
          if (isUploadCancellationError(error)) {
            this.updateItem(uploadId, {
              status: "error",
              error: "Upload cancelled.",
            });
            break;
          }

          const message =
            error instanceof Error ? error.message : "Unknown upload error.";

          this.updateItem(uploadId, {
            status: "error",
            error: message,
          });

          failed.push({
            fileName: file.name,
            error: message,
          });
        } finally {
          this.currentAbortController = null;
        }
      }
    } finally {
      if (this.state.activeBatch?.id === batchId) {
        this.setActiveBatch(null);
      }
    }

    if (uploadedCount > 0) {
      try {
        await onUploadComplete?.();
      } catch (error) {
        console.error("Upload manager batch onUploadComplete error:", error);
      }

      this.completeBatch({
        id: batchId,
        consultationId,
        petId,
        clinicId,
        vetId,
        uploadedCount,
        failedCount: failed.length,
        totalFiles: normalizedFiles.length,
        completedAt: Date.now(),
      });
    }

    return {
      uploadedCount,
      failed,
    };
  }

  async completeItem(id: string) {
    const item = this.state.items.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    this.updateItem(id, {
      status: "success",
      percentage: 100,
      uploadedBytes: item.totalBytes,
    });

    try {
      await item.onComplete?.();
    } catch (error) {
      console.error("Upload manager onComplete error:", error);
    }
  }
}

export const ultrasoundUploadManager = new UltrasoundUploadManager();
