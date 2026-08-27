import { NextRequest, NextResponse } from "next/server";
import { fetchAQI } from "@/lib/services/openmeteo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "18.52");
  const lng = parseFloat(searchParams.get("lng") ?? "73.856");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const data = await fetchAQI(lat, lng);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=600, stale-while-revalidate" },
  });
}
