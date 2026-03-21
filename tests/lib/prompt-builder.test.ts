import { describe, expect, it } from "vitest";
import { buildGardenPrompt } from "@/lib/prompt-builder";

describe("buildGardenPrompt", () => {
  it("includes optional notes", () => {
    const prompt = buildGardenPrompt({
      notes: "Family wants low-maintenance planting and safer evening path lighting.",
      images: [
        {
          name: "garden.jpg",
          mimeType: "image/jpeg",
          dataUrl: "data:image/jpeg;base64,AAA"
        }
      ]
    });

    expect(prompt).toContain("Customer brief notes:");
    expect(prompt).toContain("Family wants low-maintenance planting");
    expect(prompt).toContain("same camera angle");
  });

  it("adds fallback instruction when notes are missing", () => {
    const prompt = buildGardenPrompt({
      images: [
        {
          name: "garden.jpg",
          mimeType: "image/jpeg",
          dataUrl: "data:image/jpeg;base64,AAA"
        }
      ]
    });

    expect(prompt).toContain("none provided");
  });
});
