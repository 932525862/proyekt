import { db, ensureDb, schema } from "@/db";
import { getCategory } from "@/lib/data";
import { notifyLead } from "@/lib/telegram";

/**
 * So'rov formasi uchun endpoint.
 * Har bir so'rov bazaga yoziladi (admin panel → Zayavkalar).
 * TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID berilsa, qo'shimcha ravishda Telegram guruhingizga ham yuboriladi.
 */
type Lead = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  interest?: string;
  message?: string;
  model?: string;
  consent?: string;
  lang?: string;
};

const clean = (v: unknown, max = 1000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const lead = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    interest: clean(body.interest, 80),
    model: clean(body.model, 120),
    message: clean(body.message, 2000),
    lang: clean(body.lang, 4),
  };

  if (!lead.name || lead.phone.replace(/\D/g, "").length < 7 || body.consent !== "yes") {
    return Response.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // 1) bazaga saqlash — asosiy kanal
  let id: number | undefined;
  try {
    await ensureDb();
    const row = await db
      .insert(schema.leads)
      .values({
        createdAt: new Date(),
        name: lead.name,
        company: lead.company || null,
        phone: lead.phone,
        email: lead.email || null,
        interest: lead.interest || null,
        model: lead.model || null,
        message: lead.message || null,
        lang: lead.lang || null,
      })
      .returning({ id: schema.leads.id })
      .get();
    id = row.id;
  } catch (e) {
    console.error("[lead] bazaga yozilmadi", e);
  }

  // 2) Telegram — qo'shimcha xabarnoma (yo'nalish kodi o'rniga o'qiladigan nomi)
  const category = lead.interest ? await getCategory(lead.interest).catch(() => undefined) : undefined;
  const sent = await notifyLead({
    id,
    name: lead.name,
    company: lead.company,
    phone: lead.phone,
    email: lead.email,
    interest: category ? category.name.uz : lead.interest,
    model: lead.model,
    message: lead.message,
    lang: lead.lang,
  });

  if (!id && !sent) return Response.json({ ok: false, error: "delivery" }, { status: 502 });
  return Response.json({ ok: true, id });
}
