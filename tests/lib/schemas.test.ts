import { describe, expect, it } from "vitest";
import { gardenDesignResponseSchema } from "@/lib/schemas";

const validDesign = {
  title: "Structured Terrace Refresh",
  style: "Modern structured",
  description: "A tidy layout upgrade with refreshed paving, stronger edging, and practical planting for year-round visual order.",
  changes: [
    "Replace uneven lawn edges with steel edging and straight geometry",
    "Add porcelain paving path to connect patio and rear seating corner",
    "Install warm LED spike lighting along key boundaries",
    "Upgrade fence paint and repair tired boundary panels"
  ],
  features: ["Linear raised bed", "Integrated bench", "Warm evening lighting"],
  estimatedCost: "£7,000 - £11,000",
  confidence: 88,
  confidenceReason: "Changes are standard domestic landscaping works with minimal structural risk.",
  imagePrompt:
    "photorealistic transformed version of the uploaded garden, same garden layout, same camera angle, same boundaries and fence lines, preserve the original proportions, realistic UK residential garden"
};

describe("gardenDesignResponseSchema", () => {
  it("accepts exactly three concepts", () => {
    const parsed = gardenDesignResponseSchema.parse({
      designs: [validDesign, validDesign, validDesign]
    });

    expect(parsed.designs).toHaveLength(3);
  });

  it("rejects invalid design length and missing required prompt phrases", () => {
    const invalid = {
      designs: [
        { ...validDesign, imagePrompt: "short prompt" },
        validDesign
      ]
    };

    const result = gardenDesignResponseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
