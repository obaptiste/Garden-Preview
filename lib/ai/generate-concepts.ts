import { ZodError } from "zod";
import { buildGardenPrompt } from "@/lib/prompt-builder";
import { conceptRequestSchema, gardenDesignResponseSchema, type ConceptRequestInput, type GardenDesignResponse } from "@/lib/schemas";
import { OpenAiResponsesProvider, AnthropicProvider, FallbackAiProvider, type AiProvider } from "@/lib/ai/provider";

function extractJson(raw: string): string {
  const jsonMatch = raw.match(/\{[\s\S]*\}$/);
  return jsonMatch?.[0] ?? raw;
}

function formatValidationError(error: ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}

function createDefaultProvider(): AiProvider {
  const providers: AiProvider[] = [];
  if (process.env.OPENAI_API_KEY) {
    providers.push(new OpenAiResponsesProvider(process.env.OPENAI_API_KEY));
  }
  if (process.env.ANTHROPIC_API_KEY) {
    providers.push(new AnthropicProvider(process.env.ANTHROPIC_API_KEY));
  }
  if (providers.length === 0) {
    throw new Error("No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.");
  }
  return providers.length === 1 ? providers[0] : new FallbackAiProvider(providers);
}

export async function generateGardenConcepts(
  rawInput: ConceptRequestInput,
  provider: AiProvider = createDefaultProvider()
): Promise<GardenDesignResponse> {
  const input = conceptRequestSchema.parse(rawInput);
  const prompt = buildGardenPrompt(input);
  const images = input.images.map((image) => ({
    mimeType: image.mimeType,
    base64Data: image.dataUrl.split(",")[1] ?? ""
  }));

  const primaryRaw = await provider.generateStructuredJson(prompt, images);

  try {
    return gardenDesignResponseSchema.parse(JSON.parse(extractJson(primaryRaw)));
  } catch (error) {
    const reason = error instanceof ZodError ? formatValidationError(error) : "Malformed JSON output";
    const repairPrompt = `${prompt}\n\nYour previous output failed schema validation: ${reason}. Return corrected JSON only.`;
    const repairedRaw = await provider.generateStructuredJson(repairPrompt, images);

    return gardenDesignResponseSchema.parse(JSON.parse(extractJson(repairedRaw)));
  }
}
