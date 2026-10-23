"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveService, saveServicesSection, type FormState } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import type { T } from "@/lib/i18n";
import { SubmitButton } from "./buttons";
import { btnGhost, field, label, Section } from "./ui";

/** Xizmatlar uchun tanlanadigan ikonlar (Icon komponentidagi nomlar) */
const icons: [string, string][] = [
  ["sugar", "Kolba"],
  ["food", "Bug'doy / oziq-ovqat"],
  ["pill", "Dori vositasi"],
  ["drop", "Probirkalar"],
  ["method", "Mikroskop"],
  ["ml", "Sun'iy intellekt"],
  ["chart", "Grafik / statistika"],
  ["wrench", "Servis"],
  ["qualify", "Sifat (qalqon)"],
  ["training", "O'qitish"],
  ["support", "Maslahat / qo'llab-quvvatlash"],
  ["install", "Tekshiruv ro'yxati"],
  ["file", "Hujjat / sertifikat"],
  ["badge", "Tasdiqlangan"],
  ["award", "Akkreditatsiya"],
  ["dna", "DNK / biotexnologiya"],
  ["atom", "Kimyo"],
  ["heart", "Tibbiyot"],
  ["sprout", "Qishloq xo'jaligi"],
  ["dissolution", "Stakan"],
  ["balances", "Tarozi"],
  ["moisture-analyzers", "Tomchilar"],
  ["hplc", "Xromatogramma"],
  ["mass-spectrometry", "Spektr"],
  ["truck", "Yetkazib berish"],
  ["timer", "Muddat"],
  ["task", "Vazifa"],
  ["settings", "Sozlash"],
];

const langs = [
  ["uz", "O'zbekcha"],
  ["ru", "Русский"],
  ["en", "English"],
] as const;

type Service = { id: string; icon: string; title: T; text: T; sort: number; published: boolean };

export function ServiceForm({ service }: { service?: Service }) {
  const [state, action] = useActionState<FormState, FormData>(saveService, {});
  const [icon, setIcon] = useState(service?.icon ?? "sugar");
  const [title, setTitle] = useState(service?.title.uz ?? "");
  const [text, setText] = useState(service?.text.uz ?? "");

  return (
    <form action={action} className="grid gap-6">
      {service && <input type="hidden" name="id" value={service.id} />}
      {state.error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state.message && <p className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{state.message}</p>}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Section title="Matn" sub="Ruscha/inglizcha bo'sh qolsa — o'zbekchasi ishlatiladi">
          <div className="grid gap-4 md:grid-cols-3">
            {langs.map(([l, name]) => (
              <div key={l} className="grid content-start gap-3 rounded-md border border-line p-4">
                <span className="eyebrow text-accent">{name}</span>
                <label className={label}>
                  Xizmat nomi {l === "uz" && "*"}
                  <input
                    name={`title_${l}`}
                    required={l === "uz"}
                    defaultValue={service?.title[l] === service?.title.uz && l !== "uz" ? "" : service?.title[l]}
                    onChange={l === "uz" ? (e) => setTitle(e.target.value) : undefined}
                    className={field}
                  />
                </label>
                <label className={label}>
                  Qisqa tavsif {l === "uz" && "*"}
                  <textarea
                    name={`text_${l}`}
                    rows={4}
                    required={l === "uz"}
                    defaultValue={service?.text[l] === service?.text.uz && l !== "uz" ? "" : service?.text[l]}
                    onChange={l === "uz" ? (e) => setText(e.target.value) : undefined}
                    className={field}
                  />
                </label>
              </div>
            ))}
          </div>
        </Section>

        <div className="grid content-start gap-6">
          <Section title="Saytdagi ko'rinishi">
            <div className="rounded-lg border border-line bg-paper p-5">
              <span className="grid size-12 place-items-center rounded-md border border-accent/15 bg-accent/[0.07] text-accent">
                <Icon name={icon} className="size-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{title || "Xizmat nomi"}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{text || "Qisqa tavsif shu yerda ko'rinadi."}</p>
            </div>
          </Section>
          <Section title="Sozlamalar">
            <label className={label}>
              Tartib raqami (kichigi oldinda)
              <input name="sort" type="number" defaultValue={service?.sort ?? ""} placeholder="oxiriga" className={field} />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="published" defaultChecked={service?.published ?? true} className="size-4 accent-[var(--accent)]" />
              Saytda ko&apos;rsatish
            </label>
          </Section>
        </div>
      </div>

      <Section title="Ikon">
        <input type="hidden" name="icon" value={icon} />
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-14">
          {icons.map(([name, title]) => (
            <button
              key={name}
              type="button"
              title={title}
              aria-label={title}
              aria-pressed={icon === name}
              onClick={() => setIcon(name)}
              className={`grid aspect-square place-items-center rounded-md border transition ${
                icon === name ? "border-accent bg-accent text-accent-ink" : "border-line bg-card text-ink/70 hover:border-accent/50 hover:text-accent"
              }`}
            >
              <Icon name={name} className="size-5" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-paper/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-5">
        <SubmitButton>{service ? "O'zgarishlarni saqlash" : "Xizmatni qo'shish"}</SubmitButton>
        <Link href="/admin/services" className={btnGhost}>
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}

/** Bo'lim sarlavhasi va kirish matni */
export function ServicesSectionForm({ value, defaults }: { value: { title?: T; text?: T }; defaults: { title: T; text: T } }) {
  const [state, action] = useActionState<FormState, FormData>(saveServicesSection, {});
  return (
    <form action={action}>
      <Section title="Bo'lim sarlavhasi va matni" sub="Saytdagi “Xizmatlar” bo'limining boshida. Qaysi til bo'sh qolsa — o'sha tilda standart matn (kulrang namuna) ko'rsatiladi.">
        {state.message && <p className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{state.message}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          {langs.map(([l, name]) => (
            <div key={l} className="grid content-start gap-3 rounded-md border border-line p-4">
              <span className="eyebrow text-accent">{name}</span>
              <label className={label}>
                Sarlavha
                <textarea name={`title_${l}`} rows={2} defaultValue={value.title?.[l] ?? ""} placeholder={defaults.title[l]} className={field} />
              </label>
              <label className={label}>
                Kirish matni
                <textarea name={`text_${l}`} rows={4} defaultValue={value.text?.[l] ?? ""} placeholder={defaults.text[l]} className={field} />
              </label>
            </div>
          ))}
        </div>
        <div>
          <SubmitButton>Bo&apos;lim matnini saqlash</SubmitButton>
        </div>
      </Section>
    </form>
  );
}
