import "server-only";
import { company, siteUrl } from "./i18n";

/**
 * Telegram xabarnomalari: TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID (.env.local yoki Vercel → Environment Variables).
 * Bot guruhga qo'shilgan bo'lishi kerak.
 */
const token = () => process.env.TELEGRAM_BOT_TOKEN;
const chatId = () => process.env.TELEGRAM_CHAT_ID;
export const telegramEnabled = () => Boolean(token() && chatId());

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const time = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" });

export type LeadNotice = {
  id?: number;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  interest?: string; // o'qiladigan yo'nalish nomi
  model?: string;
  message?: string;
  lang?: string;
};

/** Yangi zayavka haqida guruhga xabar. Muvaffaqiyatli bo'lsa true qaytaradi (xato saytni to'xtatmaydi). */
export async function notifyLead(l: LeadNotice) {
  if (!telegramEnabled()) return false;
  // bo'sh maydonlar butunlay tushib qoladi; "" — ataylab qo'yilgan bo'sh qator
  const row = (icon: string, label: string, value?: string) => (value ? `${icon} <b>${label}:</b> ${esc(value)}` : null);
  const text = [
    `🧪 <b>Yangi zayavka${l.id ? ` #${l.id}` : ""}</b> — ${esc(company.name)}`,
    "",
    row("👤", "Ism", l.name),
    row("🏢", "Tashkilot", l.company),
    row("📞", "Telefon", l.phone),
    row("✉️", "Email", l.email),
    row("📦", "Yo'nalish", l.interest),
    row("🔬", "Model", l.model),
    l.message ? `💬 <b>Xabar:</b>\n${esc(l.message)}` : null,
    "",
    `🌐 ${esc((l.lang || "—").toUpperCase())} · 🕒 ${time.format(new Date())}`,
  ]
    .filter((x) => x !== null)
    .join("\n");

  // Telegram tugmalari faqat ochiq https manzilni qabul qiladi (localhost'da tugma qo'shilmaydi)
  const adminUrl = l.id && siteUrl.startsWith("https://") ? `${siteUrl}/admin/leads/${l.id}` : undefined;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token()}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId(),
        text,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        ...(adminUrl ? { reply_markup: { inline_keyboard: [[{ text: "Admin panelda ochish", url: adminUrl }]] } } : {}),
      }),
    });
    if (!res.ok) console.error("[telegram]", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[telegram] yuborilmadi", e);
    return false;
  }
}
