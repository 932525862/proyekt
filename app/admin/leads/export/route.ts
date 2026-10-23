import { cookies } from "next/headers";
import { adminLeads, leadStatuses } from "@/lib/admin-data";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/** Zayavkalarni CSV (Excel) faylga yuklab olish — joriy filtr bilan */
export async function GET(request: Request) {
  if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) return new Response("Unauthorized", { status: 401 });
  const sp = new URL(request.url).searchParams;
  const leads = await adminLeads({ status: sp.get("status") ?? "all", q: sp.get("q") ?? "" });
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["ID", "Sana", "Holat", "Ism", "Tashkilot", "Telefon", "Email", "Yo'nalish", "Model", "Xabar", "Til", "Izoh"];
  const lines = leads.map((l) =>
    [l.id, l.createdAt.toISOString(), leadStatuses.find((s) => s.value === l.status)?.label, l.name, l.company, l.phone, l.email, l.interest, l.model, l.message, l.lang, l.note]
      .map(cell)
      .join(";"),
  );
  // BOM — Excel UTF-8 (o'zbek/rus harflari) ni to'g'ri ochishi uchun
  const body = "﻿" + [head.map(cell).join(";"), ...lines].join("\r\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zayavkalar-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
