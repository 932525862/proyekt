"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProduct, type FormState } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import type { Spec } from "@/db/schema";
import type { T } from "@/lib/i18n";
import { labels, type SpecKey } from "@/lib/specs";
import { AiTranslateButton } from "./AiTranslateButton";
import { SubmitButton } from "./buttons";
import { ImageField } from "./ImageField";
import { btnGhost, field, label, Section } from "./ui";

type Product = {
  id: string;
  name: string;
  groupId: string;
  image: string | null;
  imageFit: "contain" | "cover";
  catNo: string | null;
  std: string | null;
  specs: Spec[];
  featured: boolean;
  featuredTag: string | null;
  featuredNote: T | null;
  featuredSort: number;
  sort: number;
  published: boolean;
};
type Cat = { slug: string; name: string; groups: { id: string; name: string }[] };

const specKeys = Object.keys(labels) as SpecKey[];
const asTri = (v: string | T): T => (typeof v === "string" ? { uz: v, ru: "", en: "" } : v);

export function ProductForm({ product, categories, defaultGroup, canUpload }: { product?: Product; categories: Cat[]; defaultGroup?: string; canUpload: boolean }) {
  const [state, action] = useActionState<FormState, FormData>(saveProduct, {});
  const [specs, setSpecs] = useState(() => (product?.specs ?? []).map((s, i) => ({ key: i, k: s.k, v: asTri(s.v) })));
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [nextKey, setNextKey] = useState(1000);

  return (
    <form action={action} className="grid gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      {state.error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state.message && <p className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{state.message}</p>}

      <Section title="Asosiy ma'lumot">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`${label} sm:col-span-2`}>
            Mahsulot (model) nomi *
            <input name="name" required defaultValue={product?.name} placeholder="Masalan: DIS 800i" className={field} />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Yo&apos;nalish va guruh *
            <select name="groupId" required defaultValue={product?.groupId ?? defaultGroup ?? ""} className={field}>
              <option value="" disabled>
                Tanlang…
              </option>
              {categories.map((c) => (
                <optgroup key={c.slug} label={c.name}>
                  {c.groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {c.name} → {g.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className={label}>
            Katalog raqami
            <input name="catNo" defaultValue={product?.catNo ?? ""} placeholder="1338" className={field} />
          </label>
          <label className={label}>
            Standart / muvofiqlik
            <input name="std" defaultValue={product?.std ?? ""} placeholder="Ph. Eur. 2.9.3 · USP <711>" className={field} />
          </label>
          <label className={label}>
            Tartib raqami (kichigi oldinda)
            <input name="sort" type="number" defaultValue={product?.sort ?? ""} placeholder="avtomatik" className={field} />
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? true} className="size-4 accent-[var(--accent)]" />
            Saytda ko&apos;rsatish
          </label>
        </div>
      </Section>

      <Section title="Rasm" sub="Oq yoki shaffof fonli mahsulot surati eng yaxshi ko'rinadi">
        <ImageField current={product?.image ?? null} fit={product?.imageFit ?? "contain"} canUpload={canUpload} />
      </Section>

      <Section title="Texnik xususiyatlar" sub="Model kartochkasida ko'rinadi. Ruscha/inglizcha bo'sh qolsa — o'zbekchasi ishlatiladi." action={<AiTranslateButton keys={["spec"]} />}>
        {specs.length === 0 && <p className="text-sm text-muted">Hozircha xususiyat yo&apos;q.</p>}
        {specs.map((s, i) => (
          <div key={s.key} className="grid gap-2 rounded-md border border-line p-3 sm:grid-cols-[150px_1fr_1fr_1fr_auto] sm:items-center sm:border-0 sm:p-0">
            <select name="spec_k" defaultValue={s.k} className={field} aria-label="Xususiyat">
              {specKeys.map((k) => (
                <option key={k} value={k}>
                  {labels[k].uz}
                </option>
              ))}
            </select>
            <input name="spec_uz" defaultValue={s.v.uz} placeholder="Qiymat (uz)" className={field} />
            <input name="spec_ru" defaultValue={s.v.ru === s.v.uz ? "" : s.v.ru} placeholder="ru (ixtiyoriy)" className={field} />
            <input name="spec_en" defaultValue={s.v.en === s.v.uz ? "" : s.v.en} placeholder="en (ixtiyoriy)" className={field} />
            <button type="button" onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="grid size-9 place-items-center rounded-md border border-line text-muted hover:border-red-400 hover:text-red-600" aria-label="Qatorni o'chirish">
              <Icon name="trash" className="size-4" />
            </button>
          </div>
        ))}
        <div>
          <button
            type="button"
            onClick={() => {
              setSpecs([...specs, { key: nextKey, k: "dims", v: { uz: "", ru: "", en: "" } }]);
              setNextKey(nextKey + 1);
            }}
            className={btnGhost}
          >
            <Icon name="plus" className="size-4" /> Xususiyat qo&apos;shish
          </button>
        </div>
      </Section>

      <Section title="Bosh sahifa" sub="“Laboratoriyalar eng ko'p so'raydigan tizimlar” bo'limida ko'rsatish" action={featured ? <AiTranslateButton keys={["featuredNote"]} /> : undefined}>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4 accent-[var(--accent)]" />
          Tanlangan mahsulot sifatida ko&apos;rsatish
        </label>
        {featured && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Teg (rasm ustidagi yorliq)
              <input name="featuredTag" defaultValue={product?.featuredTag ?? ""} placeholder="USP <711>" className={field} />
            </label>
            <label className={label}>
              Tartib (bosh sahifada)
              <input name="featuredSort" type="number" defaultValue={product?.featuredSort ?? 0} className={field} />
            </label>
            {(["uz", "ru", "en"] as const).map((l) => (
              <label key={l} className={`${label} ${l === "uz" ? "sm:col-span-2" : ""}`}>
                Qisqa tavsif ({l})
                <input name={`featuredNote_${l}`} defaultValue={product?.featuredNote?.[l] ?? ""} placeholder={l === "uz" ? "8 idishli dissolyutsiya testeri" : ""} className={field} />
              </label>
            ))}
          </div>
        )}
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-paper/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-5">
        <SubmitButton>{product ? "O'zgarishlarni saqlash" : "Mahsulotni qo'shish"}</SubmitButton>
        <Link href="/admin/products" className={btnGhost}>
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}
