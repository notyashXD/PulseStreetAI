import { NextRequest, NextResponse } from "next/server";
import { queryCivicCopilot } from "@/lib/services/gemini";
import { getDemoReports } from "@/lib/demo/seed";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, aqi = 142 } = body;

    const reports = getDemoReports();
    const criticalCount = reports.filter((r) => r.severity === "critical" || r.severity === "high").length;

    const contextData = {
      totalIncidents: reports.length,
      criticalCount,
      activeHotspots: 3,
      currentAQI: aqi,
      sampleIncidents: reports.slice(0, 8).map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        severity: r.severity,
        ward: r.location.ward,
        status: r.status,
      })),
    };

    const response = await queryCivicCopilot(messages || [], contextData);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Copilot API route error:", error);
    return NextResponse.json(
      { error: "Failed to generate copilot response" },
      { status: 500 }
    );
  }
}
