import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { generateGardenConcepts } from "@/lib/ai/generate-concepts";
import type { AiProvider } from "@/lib/ai/provider";

class MockProvider implements AiProvider {
  constructor(private readonly responses: string[]) {}
  private index = 0;

  async generateStructuredJson(): Promise<string> {
    const response = this.responses[this.index] ?? this.responses[this.responses.length - 1];
    this.index += 1;
    return response;
  }
}

const validOutput = JSON.stringify({
  designs: Array.from({ length: 3 }, (_, idx) => ({
    title: `Concept ${idx + 1}`,
    style: "Modern",
    description: "A realistic and buildable garden update for a UK domestic property.",
    changes: ["Change A 11111", "Change B 11111", "Change C 11111", "Change D 11111"],
    features: ["Feature A", "Feature B", "Feature C"],
    estimatedCost: "£6,000 - £9,000",
    confidence: 85,
    confidenceReason: "Visible constraints suggest this is highly achievable.",
    imagePrompt:
      "photorealistic transformed version of the uploaded garden, realistic UK residential garden, same garden layout, same camera angle, same boundaries and fence lines, preserve the original proportions"
  }))
});

describe("generateGardenConcepts", () => {
  const originalKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
  });

  afterAll(() => {
    process.env.OPENAI_API_KEY = originalKey;
  });

  it("returns validated output on first pass", async () => {
    const provider = new MockProvider([validOutput]);
    const result = await generateGardenConcepts(
      {
        images: [{ name: "a.jpg", mimeType: "image/jpeg", dataUrl: "data:image/jpeg;base64,AAA" }]
      },
      provider
    );

    expect(result.designs).toHaveLength(3);
    expect(result.designs[0].title).toBe("Concept 1");
  });

  it("retries when first response is malformed", async () => {
    const provider = new MockProvider(["not-json", validOutput]);

    const result = await generateGardenConcepts(
      {
        images: [{ name: "a.jpg", mimeType: "image/jpeg", dataUrl: "data:image/jpeg;base64,AAA" }],
        notes: "Needs child-friendly layout"
      },
      provider
    );

    expect(result.designs[2].title).toBe("Concept 3");
  });

  it("throws when API key is missing", async () => {
    process.env.OPENAI_API_KEY = "";
    const provider = new MockProvider([validOutput]);

    await expect(
      generateGardenConcepts(
        {
          images: [{ name: "a.jpg", mimeType: "image/jpeg", dataUrl: "data:image/jpeg;base64,AAA" }]
        },
        provider
      )
    ).rejects.toThrow("OPENAI_API_KEY");
  });
});
