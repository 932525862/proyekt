import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ProductImage } from "@/components/ProductImage";
import { brands } from "@/lib/catalog";
import { getCatalog, modelCount, totalModels } from "@/lib/data";
import { company, getDictionary, isLocale, tr } from "@/lib/i18n";
import { photos } from "@/lib/media";
import { breadcrumbs, catalogPage, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  const categories = await getCatalog();
  return pageMetadata({
    lang,
    path: "/products",
    title: `${d.catalog.title} — ${brands.slice(0, 4).join(", ")}`,
    description: `${d.catalog.text} ${categories.map((c) => tr(c.name, lang)).join(", ")}.`,
    keywords: [...d.meta.keywords, ...categories.map((c) => tr(c.name, lang)), ...brands],
  });
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const categories = await getCatalog();

  return (
    <>
      <JsonLd data={catalogPage(lang, categories)} />
      <JsonLd
        data={breadcrumbs([
          { name: company.brand, path: `/${lang}` },
          { name: d.catalog.title, path: `/${lang}/products` },
        ])}
      />
      <section className="relative isolate overflow-hidden bg-band pb-14 pt-[140px] text-on-band lg:pb-20 lg:pt-44">
        <Image src={photos.team.src} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover opacity-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-band via-band/90 to-band/60" />
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="eyebrow text-signal">
              {d.catalog.eyebrow} · {totalModels(categories)} {d.catalog.models}
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
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-5 sm:px-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${lang}/products/${c.slug}`}
              prefetch
              className="reveal group grid overflow-hidden rounded-lg border border-line bg-card transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_24px_50px_-24px_rgb(11_92_213/0.35)] lg:grid-cols-[0.9fr_1.1fr]"
            >
              {c.image ? (
                <ProductImage media={c.image} sizes="(min-width:1024px) 280px, 50vw" pad="p-3 sm:p-6" className="aspect-[4/3] lg:aspect-auto lg:min-h-64" />
              ) : (
                <span className="bg-dots grid aspect-[4/3] place-items-center bg-sunk text-ink/30 lg:aspect-auto lg:min-h-64">
                  <Icon name={c.slug} className="size-10" strokeWidth={1.25} />
                </span>
              )}
              <div className="flex flex-col border-t border-line p-3.5 sm:p-6 lg:border-l lg:border-t-0">
                <div className="flex flex-col items-start gap-1 eyebrow text-muted sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex min-w-0 max-w-full items-center gap-2">
                    <span className="hidden size-7 shrink-0 place-items-center rounded-md bg-accent/10 text-accent sm:grid">
                      <Icon name={c.slug} className="size-4" />
                    </span>
                    <span className="truncate">
                      <span className="hidden sm:inline">{String(c.number).padStart(2, "0")} · </span>
                      {c.brand}
                    </span>
                  </span>
                  <span className="shrink-0 text-accent">
                    {modelCount(c)} {d.catalog.models}
                  </span>
                </div>
                <h2 className="mt-2 text-[15px] font-semibold leading-snug tracking-tight sm:mt-3 sm:text-xl">{tr(c.name, lang)}</h2>
                <p className="mt-1 text-xs leading-snug text-muted sm:hidden">{tr(c.short, lang)}</p>
                <p className="mt-2 hidden text-[15px] leading-relaxed text-muted sm:line-clamp-3">{tr(c.description, lang)}</p>
                <div className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
                  {c.groups.slice(0, 4).map((g) => (
                    <span key={g.id} className="rounded-sm bg-sunk px-2 py-1 text-xs font-medium text-ink/70">
                      {tr(g.name, lang)}
                    </span>
                  ))}
                </div>
                <span className="mt-auto flex items-center gap-1.5 pt-3 text-[13px] font-semibold text-accent sm:pt-5 sm:text-sm">
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
