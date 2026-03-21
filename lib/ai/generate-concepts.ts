import { ZodError } from "zod";
import { buildGardenPrompt } from "@/lib/prompt-builder";
import { conceptRequestSchema, gardenDesignResponseSchema, type ConceptRequestInput, type GardenDesignResponse } from "@/lib/schemas";
import { OpenAiResponsesProvider, type AiProvider } from "@/lib/ai/provider";

function extractJson(raw: string): string {
  const jsonMatch = raw.match(/\{[\s\S]*\}$/);
  return jsonMatch?.[0] ?? raw;
}

function formatValidationError(error: ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}

export async function generateGardenConcepts(
  rawInput: ConceptRequestInput,
  provider: AiProvider = new OpenAiResponsesProvider(process.env.OPENAI_API_KEY ?? "")
): Promise<GardenDesignResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Server configuration missing OPENAI_API_KEY.");
  }

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
