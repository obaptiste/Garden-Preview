import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type PromptImage = {
  mimeType: string;
  base64Data: string;
};

export interface AiProvider {
  generateStructuredJson(prompt: string, images: PromptImage[]): Promise<string>;
}

function isUsageLimitError(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "status" in error) {
    return (error as { status: number }).status === 429;
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes("rate limit") || msg.includes("quota") || msg.includes("overloaded");
  }
  return false;
}

export class OpenAiResponsesProvider implements AiProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(apiKey: string, model = process.env.OPENAI_MODEL ?? "gpt-4.1") {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateStructuredJson(prompt: string, images: PromptImage[]): Promise<string> {
    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: "user",
          content: [
            ...images.map((image) => ({
              type: "input_image" as const,
              image_url: `data:${image.mimeType};base64,${image.base64Data}`,
              detail: "auto" as const
            })),
            { type: "input_text" as const, text: prompt }
          ]
        }
      ]
    });

    const outputText = response.output_text?.trim();
    if (!outputText) {
      throw new Error("AI provider returned an empty response.");
    }
    return outputText;
  }
}

export class AnthropicProvider implements AiProvider {
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(apiKey: string, model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6") {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generateStructuredJson(prompt: string, images: PromptImage[]): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            ...images.map((image) => ({
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: image.mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: image.base64Data
              }
            })),
            { type: "text" as const, text: prompt }
          ]
        }
      ]
    });

    const outputText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!outputText) {
      throw new Error("AI provider returned an empty response.");
    }
    return outputText;
  }
}

export class FallbackAiProvider implements AiProvider {
  constructor(private readonly providers: AiProvider[]) {
    if (providers.length === 0) {
      throw new Error("FallbackAiProvider requires at least one provider.");
    }
  }

  async generateStructuredJson(prompt: string, images: PromptImage[]): Promise<string> {
    let lastError: unknown;
    for (const provider of this.providers) {
      try {
        return await provider.generateStructuredJson(prompt, images);
      } catch (error) {
        if (isUsageLimitError(error)) {
          lastError = error;
          continue;
        }
        throw error;
      }
    }
    throw lastError ?? new Error("All AI providers exhausted.");
  }
}
