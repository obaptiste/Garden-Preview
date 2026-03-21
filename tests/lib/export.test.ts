import { describe, expect, it } from "vitest";
import { toClientSummary, toJsonExport } from "@/lib/export";

const response = {
  designs: [
    {
      title: "Concept A",
      style: "Modern",
      description: "Desc",
      changes: ["A", "B", "C", "D"],
      features: ["F1", "F2", "F3"],
      estimatedCost: "£5,000 - £8,000",
      confidence: 90,
      confidenceReason: "Straightforward works.",
      imagePrompt: "same garden layout same camera angle same boundaries and fence lines preserve the original proportions"
    },
    {
      title: "Concept B",
      style: "Natural",
      description: "Desc",
      changes: ["A", "B", "C", "D"],
      features: ["F1", "F2", "F3"],
      estimatedCost: "£6,000 - £9,000",
      confidence: 84,
      confidenceReason: "Moderate complexity.",
      imagePrompt: "same garden layout same camera angle same boundaries and fence lines preserve the original proportions"
    },
    {
      title: "Concept C",
      style: "Practical",
      description: "Desc",
      changes: ["A", "B", "C", "D"],
      features: ["F1", "F2", "F3"],
      estimatedCost: "£4,500 - £7,000",
      confidence: 92,
      confidenceReason: "Simple materials.",
      imagePrompt: "same garden layout same camera angle same boundaries and fence lines preserve the original proportions"
    }
  ]
} as const;

describe("export helpers", () => {
  it("creates JSON export", () => {
    const json = toJsonExport(response);
    expect(json).toContain('"designs"');
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("creates readable client summary", () => {
    const summary = toClientSummary(response);
    expect(summary).toContain("Concept 1: Concept A");
    expect(summary).toContain("Estimated Cost: £5,000 - £8,000");
    expect(summary).toContain("Image Prompt:");
  });
});
