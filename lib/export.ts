import type { GardenDesignResponse } from "@/lib/schemas";

export function toJsonExport(data: GardenDesignResponse): string {
  return JSON.stringify(data, null, 2);
}

export function toClientSummary(data: GardenDesignResponse): string {
  return data.designs
    .map((design, index) => {
      return [
        `Concept ${index + 1}: ${design.title} (${design.style})`,
        design.description,
        `Estimated Cost: ${design.estimatedCost}`,
        `Confidence: ${design.confidence}/100 — ${design.confidenceReason}`,
        "Key Changes:",
        ...design.changes.map((item) => `- ${item}`),
        "Standout Features:",
        ...design.features.map((item) => `- ${item}`),
        `Image Prompt: ${design.imagePrompt}`
      ].join("\n");
    })
    .join("\n\n---\n\n");
}
