import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateGardenConcepts } from "@/lib/ai/generate-concepts";
import { conceptRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = conceptRequestSchema.parse(payload);
    const data = await generateGardenConcepts(input);

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: `Invalid request data: ${error.issues.map((issue) => issue.message).join(", ")}`
        },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
