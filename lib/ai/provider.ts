import OpenAI from "openai";

export type PromptImage = {
  mimeType: string;
  base64Data: string;
};

export interface AiProvider {
  generateStructuredJson(prompt: string, images: PromptImage[]): Promise<string>;
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
