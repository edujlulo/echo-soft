"use client";

export default function FullTemplatesTextarea() {
  return (
    <div className="h-full w-full min-h-0 min-w-0">
      <textarea
        maxLength={100000}
        className="h-full w-full bg-white border border-blue-200 px-2 pb-0.5 pt-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:bg-white"
      />
    </div>
  );
}
