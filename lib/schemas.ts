import { z } from "zod";

export const gardenDesignSchema = z.object({
  title: z.string().min(3),
  style: z.string().min(3),
  description: z.string().min(20),
  changes: z.array(z.string().min(5)).min(4),
  features: z.array(z.string().min(3)).min(3),
  estimatedCost: z
    .string()
    .min(5)
    .regex(/£|GBP|gbp/, "Estimated cost must include a GBP indicator"),
  confidence: z.number().int().min(0).max(100),
  confidenceReason: z.string().min(12),
  imagePrompt: z
    .string()
    .min(80)
    .refine(
      (value) =>
        ["same garden layout", "same camera angle", "same boundaries and fence lines", "preserve the original proportions"].every(
          (phrase) => value.toLowerCase().includes(phrase)
        ),
      "imagePrompt must include required preservation phrases"
    )
});

export const gardenDesignResponseSchema = z.object({
  designs: z.tuple([gardenDesignSchema, gardenDesignSchema, gardenDesignSchema])
});

export const imageInputSchema = z.object({
  name: z.string(),
  mimeType: z.string().regex(/^image\//),
  dataUrl: z.string().startsWith("data:image/")
});

export const conceptRequestSchema = z.object({
  notes: z.string().max(3000).optional(),
  images: z.array(imageInputSchema).min(1).max(10)
});

export type GardenDesign = z.infer<typeof gardenDesignSchema>;
export type GardenDesignResponse = z.infer<typeof gardenDesignResponseSchema>;
export type ConceptRequestInput = z.infer<typeof conceptRequestSchema>;
