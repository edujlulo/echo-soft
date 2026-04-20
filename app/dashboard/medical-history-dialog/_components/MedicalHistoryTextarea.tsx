"use client";

import { useFinalReport } from "@/hooks/useFinalReport";

export default function MedicalHistoryTextarea() {
  const { finalReport } = useFinalReport();

  return (
    <div className="h-full w-full min-h-0 min-w-0">
      <textarea
        value={finalReport}
        readOnly
        maxLength={100000}
        className="h-full w-full resize-none rounded border border-blue-200 bg-white px-2 pb-0.5 pt-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-default"
      />
    </div>
  );
}
