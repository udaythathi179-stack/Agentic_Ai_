import { NextResponse } from "next/server";
import { memoryStore } from "@/db";

export async function GET() {
  const donations = memoryStore.getDonations();
  return NextResponse.json({ success: true, donations });
}

export async function POST(req: Request) {
  try {
    const { manifestId, status } = await req.json();
    const donations = memoryStore.getDonations();
    const item = donations.find((d) => d.id === manifestId);

    if (!item) {
      return NextResponse.json({ success: false, error: "Manifest not found" }, { status: 404 });
    }

    if (status) {
      (item as { status: string }).status = status;
    }

    return NextResponse.json({ success: true, manifest: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update donation" }, { status: 500 });
  }
}
