"use client";

import { Copy } from "lucide-react";
import type { GardenDesign } from "@/lib/schemas";

type ConceptCardProps = {
  concept: GardenDesign;
  index: number;
};

export function ConceptCard({ concept, index }: ConceptCardProps) {
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(concept.imagePrompt);
  };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Concept {index + 1}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{concept.title}</h3>
          <p className="text-sm text-slate-500">{concept.style}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{concept.confidence}/100</span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{concept.description}</p>

      <section className="mt-4 space-y-2">
        <h4 className="text-sm font-semibold text-slate-900">Specific changes</h4>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {concept.changes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 space-y-2">
        <h4 className="text-sm font-semibold text-slate-900">Standout features</h4>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {concept.features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
        <p>
          <span className="font-semibold">Estimated cost:</span> {concept.estimatedCost}
        </p>
        <p className="mt-1">
          <span className="font-semibold">Confidence rationale:</span> {concept.confidenceReason}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">Mockup image prompt</h4>
          <button
            type="button"
            onClick={copyPrompt}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
        <p className="text-xs leading-5 text-slate-600">{concept.imagePrompt}</p>
      </div>
    </article>
  );
}
