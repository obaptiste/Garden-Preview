"use client";

import { Download, FileText, Copy } from "lucide-react";
import { toClientSummary, toJsonExport } from "@/lib/export";
import type { GardenDesignResponse } from "@/lib/schemas";

type ExportActionsProps = {
  data: GardenDesignResponse;
};

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ExportActions({ data }: ExportActionsProps) {
  const json = toJsonExport(data);
  const summary = toClientSummary(data);

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        onClick={() => navigator.clipboard.writeText(json)}
      >
        <Copy className="h-4 w-4" /> Copy JSON
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        onClick={() => downloadFile("garden-concepts.json", json, "application/json")}
      >
        <Download className="h-4 w-4" /> Export JSON
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        onClick={() => downloadFile("garden-concepts-summary.txt", summary, "text/plain")}
      >
        <FileText className="h-4 w-4" /> Export Client Summary
      </button>
    </div>
  );
}
