import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ModelExplorer } from "@/components/ModelExplorer";
import { ProductImage } from "@/components/ProductImage";
import { getCatalog, getCategory, modelCount } from "@/lib/data";
import { company, getDictionary, isLocale, locales, tr } from "@/lib/i18n";
import { breadcrumbs, categoryPage, pageMetadata } from "@/lib/seo";
import { labels, specText } from "@/lib/specs";

export async function generateStaticParams() {
  const categories = await getCatalog();
  return locales.flatMap((lang) => categories.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = await getCategory(slug);
  // mavjud bo'lmagan yoki o'chirilgan yo'nalish — haqiqiy 404 status
  if (!isLocale(lang) || !c) notFound();
  const name = tr(c.name, lang);
  const city = { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" }[lang];
  return pageMetadata({
    lang,
    path: `/products/${slug}`,
    title: `${name} — ${c.brand}`,
    description: tr(c.description, lang),
    keywords: [
      name,
      `${name} ${c.brand}`,
      `${name} ${city}`,
      c.brand,
      ...c.groups.map((g) => tr(g.name, lang)),
      ...c.groups.flatMap((g) => g.products.map((p) => p.name)).slice(0, 12),
      ...c.standards,
    ],
  });
}

/**
 * Yo'nalish sahifasi. `params` Suspense ichida o'qiladi: boshqa sahifadan o'tganda
 * karkas (skeleton) darhol ko'rinadi, kontent esa tayyor bo'lishi bilan almashadi.
 * To'g'ridan-to'g'ri kirishda sahifa generateStaticParams orqali to'liq oldindan tayyor.
 */
export default function CategoryPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

function CategorySkeleton() {
  const bar = "animate-pulse rounded-md bg-white/10";
  return (
    <div aria-busy="true">
      <section className="border-b border-line bg-band pb-12 pt-[124px] lg:pb-16 lg:pt-40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-5">
            <div className={`${bar} h-3 w-40`} />
            <div className={`${bar} h-12 w-4/5`} />
            <div className={`${bar} h-4 w-full`} />
            <div className={`${bar} h-4 w-3/4`} />
          </div>
          <div className={`${bar} aspect-[4/3] rounded-lg`} />
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-line bg-card">
            <div className="aspect-[4/3] animate-pulse bg-sunk" />
            <div className="space-y-2 p-3.5">
              <div className="h-3.5 w-2/3 animate-pulse rounded bg-sunk" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-sunk" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function CategoryContent({ params }: { params: PageProps<"/[lang]/products/[slug]">["params"] }) {
  const { lang, slug } = await params;
  const [c, categories] = await Promise.all([getCategory(slug), getCatalog()]);
  if (!isLocale(lang) || !c) notFound();
  const d = getDictionary(lang);

  const groups = c.groups.map((g) => ({
    name: tr(g.name, lang),
    models: g.products.map((p) => ({
      name: p.name,
      image: p.image,
      cat: p.catNo,
      std: p.std,
      specs: p.specs.map(({ k, v }) => [tr(labels[k], lang), specText(v, lang)] as [string, string]),
    })),
  }));
  const options = categories.map((x) => ({ value: x.slug, label: tr(x.name, lang) }));
  const others = categories.filter((x) => x.slug !== c.slug);

  return (
    <>
      <JsonLd data={categoryPage(c, lang, groups.flatMap((g) => g.models.map((m) => ({ name: m.name, image: m.image?.src }))))} />
      <JsonLd
        data={breadcrumbs([
          { name: company.brand, path: `/${lang}` },
          { name: d.catalog.title, path: `/${lang}/products` },
          { name: tr(c.name, lang), path: `/${lang}/products/${c.slug}` },
        ])}
      />
      <section className="relative isolate overflow-hidden border-b border-line bg-band pb-12 pt-[124px] text-on-band lg:pb-16 lg:pt-40">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex min-w-0 items-center gap-2 text-sm text-on-band/55">
            <Link href={`/${lang}`} className="shrink-0 whitespace-nowrap hover:text-white">{company.brand}</Link>
            <span>/</span>
            <Link href={`/${lang}/products`} className="shrink-0 whitespace-nowrap hover:text-white">{d.catalog.title}</Link>
            <span>/</span>
            <span className="truncate text-on-band/85">{tr(c.name, lang)}</span>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="animate-rise">
              <span className="eyebrow text-signal">
                {String(c.number).padStart(2, "0")} · {c.brand}
              </span>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-[3.4rem]">
                {tr(c.name, lang)}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-on-band/65">{tr(c.description, lang)}</p>
              {c.standards.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={d.catalog.standards}>
                  {c.standards.map((st) => (
                    <li key={st} className="inline-flex items-center gap-1.5 rounded-sm border border-signal/30 bg-signal/10 px-2 py-1 text-xs font-medium tech text-signal">
                      <Icon name="badge" className="size-3.5" />
                      {st}
                    </li>
                  ))}
                </ul>
              )}
              <dl className="mt-8 grid max-w-md grid-cols-2 divide-x divide-white/10 rounded-lg border border-white/10 bg-white/5">
                <div className="p-4">
                  <dt className="text-xs text-on-band/50">{d.catalog.brand}</dt>
                  <dd className="mt-1 font-semibold text-white">{c.brand}</dd>
                </div>
                <div className="p-4">
                  <dt className="text-xs text-on-band/50">{d.catalog.title}</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {modelCount(c)} {d.catalog.models}
                  </dd>
                </div>
              </dl>
            </div>
            {c.image && (
              <ProductImage
                media={c.image}
                sizes="(min-width:1024px) 560px, 100vw"
                eager
                pad="p-10"
                className="aspect-[4/3] rounded-lg ring-1 ring-white/10"
              />
            )}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ModelExplorer
            lang={lang}
            slug={c.slug}
            groups={groups}
            options={options}
            dict={{ catalog: d.catalog, form: d.form }}
          />
        </div>
      </section>

      <section className="border-t border-line bg-card py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="eyebrow text-muted">{d.catalog.other}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/${lang}/products/${o.slug}`}
                prefetch
                className="group overflow-hidden rounded-lg border border-line bg-paper transition-colors hover:border-accent/50"
              >
                {o.image ? (
                  <ProductImage media={o.image} sizes="180px" pad="p-3" className="aspect-[4/3]" />
                ) : (
                  <span className="grid aspect-[4/3] place-items-center bg-sunk text-ink/30">
                    <Icon name={o.slug} className="size-7" strokeWidth={1.25} />
                  </span>
                )}
                <span className="flex items-start justify-between gap-2 border-t border-line p-3 text-[13px] font-medium leading-tight">
                  {tr(o.name, lang)}
                  <Icon name="arrow" className="size-3.5 shrink-0 text-muted transition-colors group-hover:text-accent" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
