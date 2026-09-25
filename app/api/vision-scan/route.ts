import { NextRequest, NextResponse } from "next/server";
import { scanVisionImage } from "@/lib/services/gemini";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let imageBase64 = "";
    let mimeType = "image/jpeg";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      imageBase64 = body.imageBase64 || "";
      mimeType = body.mimeType || "image/jpeg";
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 });
      }
      mimeType = file.type || "image/jpeg";
      const bytes = await file.arrayBuffer();
      imageBase64 = Buffer.from(bytes).toString("base64");
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    // Clean base64 if data URI prefix was passed
    if (imageBase64.includes(",")) {
      const parts = imageBase64.split(",");
      imageBase64 = parts[1];
      const match = parts[0].match(/data:(.*?);base64/);
      if (match) {
        mimeType = match[1];
      }
    }

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing image base64 data" }, { status: 400 });
    }

    const result = await scanVisionImage(imageBase64, mimeType);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Vision scan error:", err);
    return NextResponse.json(
      {
        isHazard: false,
        category: "other",
        confidence: 0.5,
        label: "Scan Error",
        summary: "An error occurred during vision analysis. Please try again or select category manually.",
        boxes: [],
      },
      { status: 500 }
    );
  }
}
