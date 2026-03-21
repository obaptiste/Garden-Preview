export function LoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-500" />
        <p className="text-sm font-medium text-slate-700">Analysing photos and generating three concepts…</p>
      </div>
      <p className="mt-3 text-sm text-slate-500">This may take up to 30 seconds depending on image count and model latency.</p>
    </div>
  );
}
