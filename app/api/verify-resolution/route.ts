import { NextRequest, NextResponse } from "next/server";
import { compareImages } from "@/lib/services/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.beforeBase64 || !body.afterBase64) {
      return NextResponse.json({ error: "Both before and after images are required" }, { status: 400 });
    }
    const result = await compareImages(body.beforeBase64, body.afterBase64);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Verify resolution error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
