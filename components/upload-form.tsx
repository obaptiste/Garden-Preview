"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ConceptCard } from "@/components/concept-card";
import { ExportActions } from "@/components/export-actions";
import { ImageDropzone } from "@/components/image-dropzone";
import { LoadingState } from "@/components/loading-state";
import type { GardenDesignResponse } from "@/lib/schemas";

type UploadImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type ApiImageInput = {
  name: string;
  mimeType: string;
  dataUrl: string;
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export function UploadForm() {
  const [images, setImages] = useState<UploadImage[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GardenDesignResponse | null>(null);

  const canSubmit = useMemo(() => images.length > 0 && !loading, [images.length, loading]);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) {
      return;
    }

    const nextFiles = Array.from(incoming)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file)
      }));

    setImages((current) => [...current, ...nextFiles]);
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const handleGenerate = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const apiImages: ApiImageInput[] = await Promise.all(
        images.map(async ({ file }) => ({
          name: file.name,
          mimeType: file.type,
          dataUrl: await fileToDataUrl(file)
        }))
      );

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          notes: notes.trim() || undefined,
          images: apiImages
        })
      });

      const payload = (await response.json()) as { data?: GardenDesignResponse; error?: string };
      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Failed to generate concepts. Please retry.");
      }

      setResult(payload.data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <ImageDropzone onFilesSelected={addFiles} />

          {images.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {images.map((image) => (
                <div key={image.id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image src={image.previewUrl} alt={image.file.name} width={320} height={220} className="h-36 w-full object-cover" unoptimized />
                  <div className="flex items-center justify-between p-2">
                    <p className="line-clamp-1 text-xs text-slate-600">{image.file.name}</p>
                    <button type="button" className="text-xs font-semibold text-rose-600" onClick={() => removeImage(image.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">No images selected yet.</p>
          )}

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-semibold text-slate-900">
              Customer brief notes (optional)
            </label>
            <textarea
              id="notes"
              rows={5}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="E.g. Family with young children, wants lower maintenance planting, prefers warm lighting and a seating zone."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none ring-emerald-500 placeholder:text-slate-400 focus:ring-2"
            />
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleGenerate}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Generate Concepts
          </button>

          {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        </div>
      </div>

      {loading ? <LoadingState /> : null}

      {result ? (
        <section className="space-y-4">
          <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Generated Concepts</h2>
              <p className="text-sm text-slate-600">Copy prompts, export JSON, or download a client summary.</p>
            </div>
            <ExportActions data={result} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {result.designs.map((concept, index) => (
              <ConceptCard key={`${concept.title}-${index}`} concept={concept} index={index} />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
