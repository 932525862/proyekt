import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { db, ensureDb, isPersistent } from "@/db";

/** Readiness check: fail traffic when persistent database storage is unavailable. */
export async function GET() {
  await connection();

  if (!isPersistent) {
    return Response.json({ status: "unavailable", reason: "persistent_database_not_configured" }, { status: 503 });
  }

  try {
    await ensureDb();
    await db.run(sql`SELECT 1`);
    return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
