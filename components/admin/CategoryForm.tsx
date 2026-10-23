"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveCategory, type FormState } from "@/app/admin/actions";
import type { T } from "@/lib/i18n";
import { SubmitButton } from "./buttons";
import { ImageField } from "./ImageField";
import { btnGhost, field, label, Section } from "./ui";

type Cat = {
  slug: string;
  sort: number;
  symbol: string;
  brand: string;
  name: T;
  short: T;
  description: T;
  standards: string[];
  image: string | null;
  imageFit: "contain" | "cover";
  imageAlt: string | null;
  published: boolean;
};

const langs = [
  ["uz", "O'zbekcha"],
  ["ru", "Русский"],
  ["en", "English"],
] as const;

export function CategoryForm({ category, nextSort, canUpload }: { category?: Cat; nextSort: number; canUpload: boolean }) {
  const [state, action] = useActionState<FormState, FormData>(saveCategory, {});
  return (
    <form action={action} className="grid gap-6">
      {category && <input type="hidden" name="original" value={category.slug} />}
      {state.error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state.message && <p className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{state.message}</p>}

      <Section title="Asosiy ma'lumot">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={`${label} lg:col-span-2`}>
            Sahifa manzili (slug) *
            <input
              name="slug"
              defaultValue={category?.slug}
              disabled={Boolean(category)}
              required={!category}
              pattern="[a-z0-9][a-z0-9-]{1,48}"
              placeholder="gas-chromatography"
              className={`${field} disabled:bg-sunk disabled:text-muted`}
            />
            <span className="text-xs font-normal text-muted">{category ? "Manzilni o'zgartirib bo'lmaydi (SEO havolalari buzilmasligi uchun)." : "Lotin kichik harf, raqam va “-”. Sayt manzili: /uz/products/…"}</span>
          </label>
          <label className={label}>
            Ishlab chiqaruvchi *
            <input name="brand" required defaultValue={category?.brand} placeholder="Bruker" className={field} />
          </label>
          <label className={label}>
            Tartib raqami
            <input name="sort" type="number" defaultValue={category?.sort ?? nextSort} className={field} />
          </label>
          <label className={label}>
            Qisqa belgi
            <input name="symbol" defaultValue={category?.symbol} maxLength={3} placeholder="Gc" className={field} />
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium lg:col-span-3">
            <input type="checkbox" name="published" defaultChecked={category?.published ?? true} className="size-4 accent-[var(--accent)]" />
            Saytda ko&apos;rsatish
          </label>
        </div>
      </Section>

      <Section title="Matnlar" sub="Ruscha/inglizcha bo'sh qolsa — o'zbekchasi ishlatiladi">
        <div className="grid gap-5 lg:grid-cols-3">
          {langs.map(([l, name]) => (
            <div key={l} className="grid content-start gap-3 rounded-md border border-line p-4">
              <span className="eyebrow text-accent">{name}</span>
              <label className={label}>
                Nomi {l === "uz" && "*"}
                <input name={`name_${l}`} required={l === "uz"} defaultValue={category?.name[l]} className={field} />
              </label>
              <label className={label}>
                Qisqa tavsif (kartochkada)
                <input name={`short_${l}`} defaultValue={category?.short[l]} className={field} />
              </label>
              <label className={label}>
                To&apos;liq tavsif (sahifada va Google&apos;da)
                <textarea name={`description_${l}`} rows={6} defaultValue={category?.description[l]} className={field} />
              </label>
            </div>
          ))}
        </div>
        <label className={label}>
          Standartlar / farmakopeya (vergul yoki yangi qatordan)
          <textarea name="standards" rows={2} defaultValue={category?.standards.join(", ")} placeholder="Ph. Eur. 2.9.3, USP <711>" className={field} />
        </label>
      </Section>

      <Section title="Rasm" sub="Yo'nalish kartochkasi, sahifa boshi va ijtimoiy tarmoq rasmi uchun">
        <ImageField current={category?.image ?? null} fit={category?.imageFit ?? "contain"} canUpload={canUpload} />
        <label className={label}>
          Rasm tavsifi (alt — ko&apos;zi ojizlar va Google uchun)
          <input name="imageAlt" defaultValue={category?.imageAlt ?? ""} placeholder="Bruker timsTOF mass spectrometer" className={field} />
        </label>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-paper/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-5">
        <SubmitButton>{category ? "O'zgarishlarni saqlash" : "Yo'nalishni yaratish"}</SubmitButton>
        <Link href="/admin/categories" className={btnGhost}>
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}
