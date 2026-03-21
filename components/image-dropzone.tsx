"use client";

import { useRef } from "react";

type ImageDropzoneProps = {
  onFilesSelected: (files: FileList | null) => void;
};

export function ImageDropzone({ onFilesSelected }: ImageDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onFilesSelected(event.dataTransfer.files);
      }}
      className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center"
    >
      <p className="text-sm font-medium text-slate-700">Drag and drop garden photos here</p>
      <p className="mt-1 text-xs text-slate-500">PNG, JPG, or WEBP. You can add multiple images.</p>
      <button
        type="button"
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        onClick={() => fileInputRef.current?.click()}
      >
        Choose Images
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(event) => onFilesSelected(event.target.files)}
      />
    </div>
  );
}
