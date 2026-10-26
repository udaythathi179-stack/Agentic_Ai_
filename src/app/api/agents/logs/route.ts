import { NextResponse } from "next/server";
import { memoryStore } from "@/db";

export async function GET() {
  const logs = memoryStore.getLogs();
  return NextResponse.json({ success: true, logs });
}
