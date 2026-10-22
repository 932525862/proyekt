import { company } from "@/lib/i18n";

/**
 * So'rov formasi uchun endpoint.
 * TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID muhit o'zgaruvchilari berilsa,
 * har bir so'rov Telegram guruhingizga yuboriladi.
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

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const text = [
      `🧪 Yangi so'rov — ${company.name}`,
      `👤 ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
      `📞 ${lead.phone}`,
      lead.email && `✉️ ${lead.email}`,
      lead.interest && `📦 ${lead.interest}`,
      lead.model && `🔬 ${lead.model}`,
      lead.message && `💬 ${lead.message}`,
      `🌐 ${lead.lang}`,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) return Response.json({ ok: false, error: "delivery" }, { status: 502 });
  } else {
    console.info("[lead]", lead);
  }

  return Response.json({ ok: true });
}
