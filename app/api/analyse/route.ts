import { NextRequest, NextResponse } from "next/server";
import { analyseReport } from "@/lib/services/gemini";
import { AIAnalysisSchema, IssueCategorySchema } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category = IssueCategorySchema.safeParse(body.category);
    if (!category.success) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const analysis = await analyseReport(
      body.imageBase64 ?? null,
      body.text ?? "",
      category.data
    );

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Analyse route error:", err);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
