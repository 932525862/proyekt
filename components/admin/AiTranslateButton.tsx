"use client";

import { useRef, useState } from "react";
import { aiTranslate } from "@/app/admin/actions";
import type { Locale } from "@/lib/i18n";
import { btnGhost } from "./ui";

const LANGS: Locale[] = ["uz", "ru", "en"];
type El = HTMLInputElement | HTMLTextAreaElement;

/**
 * Forma ichidagi `<kalit>_uz|ru|en` maydonlaridan to'ldirilganini topib, bo'sh tillarni AI bilan to'ldiradi.
 * Bir xil nomli bir nechta maydon (masalan `spec_uz`) tartib bo'yicha juftlanadi.
 * Faqat tugma bosilganda ishlaydi; allaqachon yozilgan matn hech qachon o'zgarmaydi.
 */
export function AiTranslateButton({ keys }: { keys: string[] }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const run = async () => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const fields = new Map<string, Record<Locale, El>>();
    const items: ({ id: string } & Record<Locale, string>)[] = [];
    for (const k of keys) {
      const cols = LANGS.map((l) => Array.from(form.querySelectorAll<El>(`[name="${k}_${l}"]`)));
      for (let i = 0; i < cols[0].length; i++) {
        const els = { uz: cols[0][i], ru: cols[1][i], en: cols[2][i] };
        if (!els.uz || !els.ru || !els.en) continue;
        const id = `${k}:${i}`;
        const values = { uz: els.uz.value, ru: els.ru.value, en: els.en.value };
        if (!LANGS.some((l) => values[l].trim()) || LANGS.every((l) => values[l].trim())) continue;
        fields.set(id, els);
        items.push({ id, ...values });
      }
    }
    if (items.length === 0) {
      setMsg({ ok: false, text: "Tarjima qilinadigan narsa yo'q: avval bitta tilda matn kiriting, boshqa til maydonlari bo'sh bo'lsin." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const { result, error } = await aiTranslate(items);
    setBusy(false);
    if (error || !result) return setMsg({ ok: false, text: error ?? "Xatolik yuz berdi." });

    let filled = 0;
    for (const [id, tr] of Object.entries(result)) {
      for (const l of LANGS) {
        const el = fields.get(id)?.[l];
        // tarjima kutilayotgan vaqtda foydalanuvchi yozib qo'ygan bo'lsa — tegmaymiz
        if (el && tr[l] && !el.value.trim()) {
          // React'ning onChange'i (masalan, oldindan ko'rish) ishlashi uchun native setter + input hodisasi
          const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, tr[l]!);
          el.dispatchEvent(new Event("input", { bubbles: true }));
          filled++;
        }
      }
    }
    setMsg({ ok: filled > 0, text: filled > 0 ? `${filled} ta maydon to'ldirildi. Tekshirib, kerak bo'lsa tahrirlang, so'ng saqlang.` : "Hech narsa to'ldirilmadi." });
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button ref={ref} type="button" onClick={run} disabled={busy} className={btnGhost}>
        <span aria-hidden>✨</span>
        {busy ? "Tarjima qilinmoqda…" : "AI bilan tarjima"}
      </button>
      {msg && (
        <p role="status" className={`max-w-xs text-right text-xs ${msg.ok ? "text-emerald-700" : "text-red-600"}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
