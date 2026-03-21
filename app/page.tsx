import { UploadForm } from "@/components/upload-form";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Kent, UK Domestic Landscaping
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Garden Concept Generator
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
          Upload one or more garden photos, add optional client notes, and generate three realistic transformation directions with
          buildable image prompts.
        </p>
      </header>
      <UploadForm />
    </main>
  );
}
