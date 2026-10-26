import { NextResponse } from "next/server";
import { getDrizzleDb, memoryStore } from "@/db";

export async function GET() {
  const isPostgresConfigured = Boolean(process.env.DATABASE_URL);
  const isSupabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("demo-zero-waste");

  let drizzleConnected = false;
  try {
    const dbClient = getDrizzleDb();
    drizzleConnected = Boolean(dbClient);
  } catch (e) {
    drizzleConnected = false;
  }

  return NextResponse.json({
    success: true,
    database: {
      isPostgresConfigured,
      isSupabaseConfigured,
      drizzleConnected,
      mode: isPostgresConfigured ? "Production Supabase / PostgreSQL" : "Interactive In-Memory Engine",
      batchesCount: memoryStore.getBatches().length,
      productsCount: memoryStore.getProducts().length,
      bundlesCount: memoryStore.getBundles().length,
      donationsCount: memoryStore.getDonations().length,
      logsCount: memoryStore.getLogs().length,
    },
  });
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json().catch(() => ({}));
    if (action === "reset") {
      memoryStore.reset();
      return NextResponse.json({ success: true, message: "Inventory & agents reset to original state" });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Action failed" }, { status: 500 });
  }
}
