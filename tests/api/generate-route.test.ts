import { beforeEach, describe, expect, it, vi } from "vitest";

const generateMock = vi.fn();

vi.mock("@/lib/ai/generate-concepts", () => ({
  generateGardenConcepts: (...args: unknown[]) => generateMock(...args)
}));

import { POST } from "@/app/api/generate/route";

describe("POST /api/generate", () => {
  beforeEach(() => {
    generateMock.mockReset();
  });

  it("returns 200 with data for valid payload", async () => {
    generateMock.mockResolvedValue({
      designs: [
        {
          title: "A",
          style: "Modern",
          description: "A realistic and buildable garden update for a UK domestic property.",
          changes: ["a11111", "b11111", "c11111", "d11111"],
          features: ["f1", "f2", "f3"],
          estimatedCost: "£1,000 - £2,000",
          confidence: 80,
          confidenceReason: "Reasonable",
          imagePrompt:
            "photorealistic transformed version of the uploaded garden, realistic UK residential garden, same garden layout, same camera angle, same boundaries and fence lines, preserve the original proportions"
        },
        {
          title: "B",
          style: "Natural",
          description: "A realistic and buildable garden update for a UK domestic property.",
          changes: ["a11111", "b11111", "c11111", "d11111"],
          features: ["f1", "f2", "f3"],
          estimatedCost: "£1,000 - £2,000",
          confidence: 80,
          confidenceReason: "Reasonable",
          imagePrompt:
            "photorealistic transformed version of the uploaded garden, realistic UK residential garden, same garden layout, same camera angle, same boundaries and fence lines, preserve the original proportions"
        },
        {
          title: "C",
          style: "Practical",
          description: "A realistic and buildable garden update for a UK domestic property.",
          changes: ["a11111", "b11111", "c11111", "d11111"],
          features: ["f1", "f2", "f3"],
          estimatedCost: "£1,000 - £2,000",
          confidence: 80,
          confidenceReason: "Reasonable",
          imagePrompt:
            "photorealistic transformed version of the uploaded garden, realistic UK residential garden, same garden layout, same camera angle, same boundaries and fence lines, preserve the original proportions"
        }
      ]
    });

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        images: [{ name: "garden.jpg", mimeType: "image/jpeg", dataUrl: "data:image/jpeg;base64,AAA" }]
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.data.designs).toHaveLength(3);
  });

  it("returns 400 for invalid request payload", async () => {
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ images: [] })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
