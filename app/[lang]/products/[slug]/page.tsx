import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ModelExplorer } from "@/components/ModelExplorer";
import { ProductImage } from "@/components/ProductImage";
import { categories, getCategory, modelCount } from "@/lib/catalog";
import { alternates, getDictionary, isLocale, locales, tr } from "@/lib/i18n";
import { categoryMedia, modelImage } from "@/lib/media";
import { labels, modelSpecs, specText } from "@/lib/specs";

export async function generateStaticParams() {
  return locales.flatMap((lang) => categories.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCategory(slug);
  if (!isLocale(lang) || !c) return {};
  return { title: tr(c.name, lang), description: tr(c.description, lang), alternates: alternates(lang, `/products/${slug}`) };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  const c = getCategory(slug);
  if (!isLocale(lang) || !c) notFound();
  const d = getDictionary(lang);

  const groups = c.groups.map((g) => ({
    name: typeof g.name === "string" ? g.name : tr(g.name, lang),
    models: g.models.map((m) => {
      const spec = modelSpecs[m];
      return {
        name: m,
        image: modelImage(c, g.name, m),
        cat: spec?.cat,
        std: spec?.std,
        specs: spec?.specs.map(([k, v]) => [tr(labels[k], lang), specText(v, lang)] as [string, string]),
      };
    }),
  }));
  const options = categories.map((x) => ({ value: x.slug, label: tr(x.name, lang) }));
  const others = categories.filter((x) => x.slug !== c.slug);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line bg-band pb-12 pt-[124px] text-on-band lg:pb-16 lg:pt-40">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-on-band/55">
            <Link href={`/${lang}`} className="hover:text-white">NovaLab</Link>
            <span>/</span>
            <Link href={`/${lang}/products`} className="hover:text-white">{d.catalog.title}</Link>
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
              {c.standards && (
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
            <ProductImage
              media={categoryMedia[c.slug]}
              sizes="(min-width:1024px) 560px, 100vw"
              preload
              pad="p-10"
              className="aspect-[4/3] rounded-lg ring-1 ring-white/10"
            />
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
                className="group overflow-hidden rounded-lg border border-line bg-paper transition-colors hover:border-accent/50"
              >
                <ProductImage media={categoryMedia[o.slug]} sizes="180px" pad="p-3" className="aspect-[4/3]" />
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
