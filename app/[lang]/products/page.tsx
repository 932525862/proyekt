import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ProductImage } from "@/components/ProductImage";
import { brands, categories, modelCount, totalModels } from "@/lib/catalog";
import { alternates, getDictionary, isLocale, tr } from "@/lib/i18n";
import { categoryMedia, photos } from "@/lib/media";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return { title: d.catalog.title, description: d.catalog.text, alternates: alternates(lang, "/products") };
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-band pb-14 pt-[140px] text-on-band lg:pb-20 lg:pt-44">
        <Image src={photos.team.src} alt="" fill preload sizes="100vw" className="-z-20 object-cover opacity-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-band via-band/90 to-band/60" />
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="eyebrow text-signal">
              {d.catalog.eyebrow} · {totalModels} {d.catalog.models}
            </span>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.028em] text-white sm:text-6xl">{d.catalog.title}</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-on-band/65">{d.catalog.text}</p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:justify-end">
            {brands.map((b) => (
              <li key={b} className="rounded-md border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/80">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${lang}/products/${c.slug}`}
              className="reveal group grid overflow-hidden rounded-lg border border-line bg-card transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_24px_50px_-24px_rgb(11_92_213/0.35)] sm:grid-cols-[0.9fr_1.1fr]"
            >
              <ProductImage media={categoryMedia[c.slug]} sizes="(min-width:1024px) 280px, (min-width:640px) 45vw, 100vw" className="aspect-[4/3] sm:aspect-auto sm:min-h-64" />
              <div className="flex flex-col p-6 sm:border-l sm:border-line">
                <div className="flex items-center justify-between eyebrow text-muted">
                  <span className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-md bg-accent/10 text-accent">
                      <Icon name={c.slug} className="size-4" />
                    </span>
                    {String(c.number).padStart(2, "0")} · {c.brand}
                  </span>
                  <span className="text-accent">
                    {modelCount(c)} {d.catalog.models}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{tr(c.name, lang)}</h2>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted">{tr(c.description, lang)}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.groups.slice(0, 4).map((g) => (
                    <span key={typeof g.name === "string" ? g.name : g.name.en} className="rounded-sm bg-sunk px-2 py-1 text-xs font-medium text-ink/70">
                      {typeof g.name === "string" ? g.name : tr(g.name, lang)}
                    </span>
                  ))}
                </div>
                <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent">
                  {d.catalog.request}
                  <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-muted sm:px-6">{d.catalog.imageNote}</p>
      </section>
    </>
  );
}
