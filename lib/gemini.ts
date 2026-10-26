import "server-only";
import type { Locale } from "./i18n";

export type TranslateItem = { id: string } & Record<Locale, string>;

const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const names: Record<Locale, string> = { uz: "Uzbek (Latin script)", ru: "Russian", en: "English" };

/**
 * Bo'sh tillarni to'ldiradi: har bir element uchun mavjud matndan (uz > ru > en) qolgan tillarga tarjima.
 * Faqat bo'sh maydonlar qaytariladi.
 */
export async function translateMissing(items: TranslateItem[]): Promise<Record<string, Partial<Record<Locale, string>>>> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Serverda GEMINI_API_KEY o'rnatilmagan.");

  const call = () =>
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text:
              "You translate product catalog texts of a laboratory analytical instruments distributor (Tashkent, Uzbekistan) between Uzbek (Latin), Russian and English. " +
              "Keep brand names, model names, catalog numbers, units, chemical formulas and standards (USP, Ph. Eur., ISO...) unchanged. " +
              "Keep the tone concise and professional. For each item, fill every language whose value is empty by translating the non-empty one(s). " +
              "Return only JSON: {\"items\":[{\"id\":string,\"uz\":string,\"ru\":string,\"en\":string}]} with all three languages filled.",
          },
        ],
      },
      contents: [{ role: "user", parts: [{ text: JSON.stringify({ items }) }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
    signal: AbortSignal.timeout(45_000),
  });

  // band bo'lsa (503/429) qisqa pauza bilan qayta urinadi
  let res = await call();
  for (let i = 0; i < 2 && (res.status === 503 || res.status === 429); i++) {
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    res = await call();
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(`Gemini xatosi (${res.status}): ${body?.error?.message ?? res.statusText}`);
  }
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new Error("Gemini bo'sh javob qaytardi.");

  let parsed: { items?: TranslateItem[] };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini javobini o'qib bo'lmadi. Qayta urinib ko'ring.");
  }

  const out: Record<string, Partial<Record<Locale, string>>> = {};
  for (const it of parsed.items ?? []) {
    const src = items.find((x) => x.id === it.id);
    if (!src) continue;
    out[it.id] = {};
    for (const l of Object.keys(names) as Locale[]) {
      if (!src[l].trim() && typeof it[l] === "string" && it[l].trim()) out[it.id][l] = it[l].trim();
    }
  }
  return out;
}
