import { NextResponse } from "next/server";
import { memoryStore } from "@/db";

export async function GET() {
  const forecasts = memoryStore.getDemandForecasts();
  return NextResponse.json({ success: true, forecasts });
}
