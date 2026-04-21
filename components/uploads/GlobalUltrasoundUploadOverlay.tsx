"use client";

import { useMemo } from "react";
import { useUltrasoundUploadManager } from "@/components/providers/UltrasoundUploadManagerProvider";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GlobalUltrasoundUploadOverlay() {
  const { state } = useUltrasoundUploadManager();

  const summary = useMemo(() => {
    const totalItems = state.items.length;

    const activeItems = state.items.filter(
      (item) => item.status === "queued" || item.status === "uploading",
    );

    const totalBytes = state.items.reduce(
      (sum, item) => sum + item.totalBytes,
      0,
    );

    const uploadedBytes = state.items.reduce(
      (sum, item) => sum + item.uploadedBytes,
      0,
    );

    const percentage =
      totalBytes > 0
        ? Math.min(100, Math.round((uploadedBytes / totalBytes) * 100))
        : 0;

    return {
      totalItems,
      activeItems,
      totalBytes,
      uploadedBytes,
      percentage,
    };
  }, [state.items]);

  if (!state.isVisible || state.items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[180px] rounded-xl border border-gray-300 bg-white p-5 shadow-2xl">
      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-800">
          Subida de imágenes
        </p>
        {/* <p className="text-sm text-gray-500">
          {summary.activeItems.length} activas · {summary.totalItems} en total
        </p> */}
      </div>

      <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-150"
          style={{ width: `${summary.percentage}%` }}
        />
      </div>

      {/* <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
        <span>{summary.percentage}%</span>
        <span>
          {formatBytes(summary.uploadedBytes)} /{" "}
          {formatBytes(summary.totalBytes)}
        </span>
      </div> */}

      {/* <div className="mt-4 max-h-56 space-y-2 overflow-y-auto">
        {state.items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">
                  {item.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  Consulta: {item.consultationId}
                </p>
              </div>

              <div className="shrink-0 text-xs font-semibold text-gray-600">
                {item.percentage}%
              </div>
            </div>

            {item.error ? (
              <p className="mt-1 text-xs text-red-600">{item.error}</p>
            ) : null}
          </div>
        ))}
      </div> */}
    </div>
  );
}
