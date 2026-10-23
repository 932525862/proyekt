import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { LabScene } from "@/components/LabScene";
import { LeadForm } from "@/components/LeadForm";
import { ProductImage } from "@/components/ProductImage";
import { applications, brands } from "@/lib/catalog";
import { getCatalog, getContacts, getFeatured, getServices, getServicesSection, modelCount } from "@/lib/data";
import { getDictionary, isLocale, tr } from "@/lib/i18n";
import { blurProps, industries, pharmaFlow, photos } from "@/lib/media";
import { faqPage } from "@/lib/seo";

const trustIcons = ["calendar", "boxes", "factory", "timer"];
const processIcons = ["task", "config", "truck", "install", "support"];
const pointIcons = ["badge", "award", "file", "languages"];
const pharmaSteps = [
  { media: pharmaFlow.powder, slug: "powder-testing", icon: "powder-testing" },
  { media: pharmaFlow.tablet, slug: "tablet-testing", icon: "tablet-testing" },
  { media: pharmaFlow.disintegration, slug: "dissolution", icon: "timer" },
  { media: pharmaFlow.dissolution, slug: "dissolution", icon: "dissolution" },
  { media: pharmaFlow.inhaler, slug: "inhaler-testing", icon: "inhaler-testing" },
];

const wrap = "mx-auto max-w-7xl px-4 sm:px-6";
const h2 = "mt-4 text-balance text-[2rem] font-semibold leading-[1.12] tracking-[-0.022em] sm:text-[2.6rem]";

function Eyebrow({ n, children, dark = false }: { n: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-3 eyebrow ${
        dark ? "text-on-band/60" : "text-muted"
      }`}
    >
      <span className={dark ? "text-signal" : "text-accent"}>{n}</span>
      <span className={`h-px w-8 ${dark ? "bg-signal/60" : "bg-accent/60"}`} />
      {children}
    </span>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const [categories, featured, contacts, services, servicesSection] = await Promise.all([getCatalog(), getFeatured(), getContacts(), getServices(), getServicesSection()]);
  const options = categories.map((c) => ({ value: c.slug, label: tr(c.name, lang) }));
  const standards = [...new Set(categories.flatMap((c) => c.standards))];

  return (
    <>
      <JsonLd data={faqPage(lang)} />
      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-band pt-[100px] text-on-band lg:pt-28">
        <Image
          src={photos.hero.src}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="-z-20 object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,var(--band)_25%,rgb(7_22_41/0.85)_55%,rgb(7_22_41/0.55))]" />
        <div className="bg-blueprint absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />

        <div className={`${wrap} grid items-center gap-8 pb-12 pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pb-16 lg:pt-20`}>
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2.5 rounded-sm border border-white/15 bg-white/5 px-3 py-1.5 eyebrow text-on-band/80 backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative size-2 rounded-full bg-signal" />
              </span>
              {d.hero.eyebrow}
            </span>
            <h1 className="mt-7 text-balance text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.028em] text-white sm:text-[3.4rem] lg:text-[4rem]">
              {d.hero.title1} <span className="bg-gradient-to-r from-[#5b9bff] to-signal bg-clip-text text-transparent">{d.hero.titleEm}</span>{" "}
              {d.hero.title2}
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-on-band/70">{d.hero.text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/products`}
                className="group inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 font-semibold text-accent-ink transition-colors hover:bg-white hover:text-band"
              >
                {d.hero.primary}
                <Icon name="arrow" className="size-[18px] transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/${lang}#contact`}
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/25 px-6 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <Icon name="phone" className="size-4" />
                {d.hero.secondary}
              </Link>
            </div>
          </div>

          {/* 3D molekula + o'lchov "HUD" detallari */}
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <LabScene variant="molecule" className="absolute inset-0" />
            <div aria-hidden className="pointer-events-none absolute inset-0 font-mono text-[11px] tracking-[0.04em] text-on-band/60">
              <span className="absolute left-0 top-6 border-l border-signal/60 pl-3">
                <span className="block text-signal">C₈H₁₀N₄O₂</span>
                Caffeine · CAS 58-08-2
              </span>
              <span className="absolute bottom-10 right-0 border-r border-signal/60 pr-3 text-right">
                <span className="block text-white/80">m/z 195.0877</span>
                [M+H]⁺ · ESI-QTOF
              </span>
              <span className="absolute bottom-24 left-2 hidden sm:block">
                ¹H NMR · 90 MHz
                <svg viewBox="0 0 140 34" className="mt-1.5 h-8 w-36 text-signal/80">
                  <path
                    d="M0 32 H22 L25 8 L28 32 H52 L54 20 L56 32 H80 L83 2 L86 32 H110 L112 24 L114 32 H140"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    pathLength={100}
                    strokeDasharray={100}
                    strokeDashoffset={100}
                    className="animate-draw"
                  />
                </svg>
              </span>
              {/* burchak belgilari */}
              {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
                <span key={c} className={`absolute size-5 border-white/25 ${c}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <dl className={`${wrap} grid grid-cols-2 lg:grid-cols-4`}>
            {d.trust.map((t, i) => (
              <div
                key={t.v}
                className={`py-7 lg:py-8 ${i % 2 === 1 ? "border-l border-white/10 pl-5 sm:pl-8" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""} ${i > 1 ? "border-t border-white/10 lg:border-t-0" : ""}`}
              >
                <dt className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-white sm:text-[2.2rem]">
                  <Icon name={trustIcons[i]} className="hidden size-7 text-signal sm:block" strokeWidth={1.5} />
                  {t.k}
                </dt>
                <dd className="mt-1 text-sm text-on-band/60 sm:pl-10">{t.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= BRANDS ================= */}
      <section aria-label={d.brands} className="border-b border-line bg-card">
        <div className={`${wrap} flex flex-col gap-5 py-8 md:flex-row md:items-center md:gap-12`}>
          <span className="shrink-0 eyebrow text-muted">{d.brands}</span>
          <ul className="grid flex-1 grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 md:flex md:justify-between">
            {brands.map((b) => (
              <li key={b} className="text-xl font-semibold tracking-tight text-ink/60 transition-colors hover:text-ink sm:text-[1.4rem]">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= PRODUCT LINES ================= */}
      <section className="py-20 lg:py-28">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow n="01">{d.lines.eyebrow}</Eyebrow>
              <h2 className={h2}>{d.lines.title}</h2>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">{d.lines.text}</p>
            </div>
            <Link href={`/${lang}/products`} className="group inline-flex items-center gap-2 font-semibold text-accent">
              {d.featured.all}
              <Icon name="arrow" className="size-[18px] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/${lang}/products/${c.slug}`}
                prefetch
                className="reveal group flex flex-col overflow-hidden rounded-lg border border-line bg-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-24px_rgb(11_92_213/0.35)]"
              >
                {c.image && <ProductImage media={c.image} sizes="(min-width:1024px) 300px, 50vw" pad="p-3 sm:p-6" className="aspect-[4/3]" />}
                <div className="flex flex-1 flex-col border-t border-line p-3.5 sm:p-5">
                  <div className="flex flex-col items-start gap-1 eyebrow text-muted sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex min-w-0 max-w-full items-center gap-2">
                      <span className="hidden size-7 shrink-0 place-items-center rounded-md bg-accent/10 text-accent sm:grid">
                        <Icon name={c.slug} className="size-4" />
                      </span>
                      <span className="truncate">{c.brand}</span>
                    </span>
                    <span className="shrink-0 text-accent">
                      {modelCount(c)} {d.hero.models}
                    </span>
                  </div>
                  <h3 className="mt-2 text-[15px] font-semibold leading-snug tracking-tight sm:mt-3 sm:text-lg">{tr(c.name, lang)}</h3>
                  <p className="mt-1 text-xs leading-snug text-muted sm:text-sm">{tr(c.short, lang)}</p>
                  <span className="mt-auto flex items-center gap-1.5 pt-3 text-[13px] font-semibold text-accent opacity-80 transition-opacity group-hover:opacity-100 sm:pt-5 sm:text-sm">
                    {d.catalog.request}
                    <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="border-y border-line bg-card py-20 lg:py-28">
        <div className={wrap}>
          <div className="max-w-2xl">
            <Eyebrow n="02">{d.featured.eyebrow}</Eyebrow>
            <h2 className={h2}>{d.featured.title}</h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {featured.map(({ product: p, category: cat }, i) => {
              // toq sonli ro'yxatda oxirgi kartochka telefonda butun qatorni egallaydi
              const wide = featured.length % 2 === 1 && i === featured.length - 1;
              return (
                <Link
                  key={p.id}
                  href={`/${lang}/products/${cat.slug}`}
                  className={`reveal group relative flex flex-col ${wide ? "col-span-2 lg:col-span-1" : ""} overflow-hidden rounded-lg border border-line bg-paper transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_24px_50px_-24px_rgb(11_92_213/0.35)]`}
                >
                  <div className="relative">
                    <ProductImage
                      media={p.image ?? cat.image ?? { src: photos.pipette.src, alt: p.name, fit: "cover" }}
                      sizes={wide ? "(min-width:1024px) 400px, 100vw" : "(min-width:1024px) 400px, 50vw"}
                      className={wide ? "aspect-[2/1] lg:aspect-[16/11]" : "aspect-[4/3] sm:aspect-[16/11]"}
                      pad="p-3 sm:p-8"
                    />
                    <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-sm bg-band px-2 py-0.5 text-[11px] font-semibold tech text-white sm:left-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-xs">{p.featuredTag}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 sm:p-6">
                    <span className="truncate eyebrow text-muted">
                      {cat.brand}
                      <span className="hidden sm:inline"> · {tr(cat.name, lang)}</span>
                    </span>
                    <h3 className="mt-1.5 text-base font-semibold leading-snug tracking-tight sm:mt-2 sm:text-2xl">{p.name}</h3>
                    <p className="mb-3 mt-1 text-xs leading-snug text-muted sm:mb-6 sm:mt-1.5 sm:text-base">{p.featuredNote ? tr(p.featuredNote, lang) : (p.std ?? "")}</p>
                    <span className="mt-auto flex items-center justify-between border-t border-line pt-3 text-[13px] font-semibold sm:pt-4 sm:text-sm">
                      <span className="text-accent">{d.nav.quote}</span>
                      <Icon name="arrowUp" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:size-5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PHARMA QC ================= */}
      <section id="pharma" className="py-20 lg:py-28">
        <div className={wrap}>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
            <div>
              <Eyebrow n="03">{d.pharma.eyebrow}</Eyebrow>
              <h2 className={h2}>{d.pharma.title}</h2>
            </div>
            <div>
              <p className="text-[17px] leading-relaxed text-muted">{d.pharma.text}</p>
              <Link href={`/${lang}/products/dissolution`} className="group mt-5 inline-flex items-center gap-2 font-semibold text-accent">
                Copley Scientific
                <Icon name="arrow" className="size-[18px] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <ol className="relative mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-5">
            <span aria-hidden className="absolute inset-x-[10%] top-[calc(50%-2rem)] hidden h-px bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 lg:block" />
            {d.pharma.steps.map((step, i) => {
              const s = pharmaSteps[i];
              return (
                <li key={step.t} className={`reveal relative ${i === d.pharma.steps.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}>
                  <Link
                    href={`/${lang}/products/${s.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_50px_-24px_rgb(11_92_213/0.35)]"
                  >
                    <div className="relative">
                      <ProductImage
                        media={s.media}
                        sizes="(min-width:1024px) 240px, 50vw"
                        pad="p-3 sm:p-6"
                        className={i === d.pharma.steps.length - 1 ? "aspect-[2/1] lg:aspect-square" : "aspect-square"}
                      />
                      <span className="absolute left-2 top-2 rounded-sm bg-band px-2 py-0.5 text-[11px] font-semibold tech text-white sm:left-3 sm:top-3 sm:py-1 sm:text-xs">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-1 flex-col border-t border-line p-3.5 sm:p-5">
                      <span className="flex items-center gap-2 sm:gap-2.5">
                        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-accent text-accent-ink sm:size-8">
                          <Icon name={s.icon} className="size-4 sm:size-[18px]" />
                        </span>
                        <h3 className="text-[15px] font-semibold tracking-tight sm:text-lg">{step.t}</h3>
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-muted sm:mt-3 sm:text-sm">{step.d}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-col overflow-hidden rounded-lg border border-line bg-card md:flex-row md:items-center">
            <span className="flex shrink-0 items-center gap-2.5 border-b border-line px-5 py-4 eyebrow text-muted md:border-b-0 md:border-r">
              <Icon name="badge" className="size-4 text-accent" />
              {d.pharma.standards}
            </span>
            <div className="flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
              <ul className="flex w-max animate-marquee gap-2 py-3 pr-2 hover:[animation-play-state:paused]">
                {[...standards, ...standards].map((st, i) => (
                  <li key={i} className="whitespace-nowrap rounded-sm border border-line bg-paper px-2.5 py-1 text-xs font-medium tech text-ink/75">
                    {st}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="py-20 lg:py-28">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[0.95fr_1.3fr] lg:gap-16`}>
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow n="04">{d.services.eyebrow}</Eyebrow>
            <h2 className={h2}>{servicesSection.title?.[lang] || d.services.title}</h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">{servicesSection.text?.[lang] || d.services.text}</p>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-lg">
              <Image src={photos.pipette.src} {...blurProps(photos.pipette.src)} alt={photos.pipette.alt} fill sizes="(min-width:1024px) 480px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-band/80 via-transparent" />
              <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
                <span className="block h-1/3 animate-scan bg-gradient-to-b from-transparent via-signal/25 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 text-white">
                <span className="eyebrow text-white/70">
                  ISO/IEC 17025 · GLP
                  <span className="mt-1 block text-base font-semibold normal-case tracking-tight text-white">IQ / OQ / PQ</span>
                </span>
                <span className="grid size-12 place-items-center rounded-md bg-accent text-accent-ink">
                  <Icon name="check" className="size-6" />
                </span>
              </div>
            </div>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2">
            {services.map((s, i) => (
              <li
                key={s.id}
                className={`reveal group rounded-lg border border-line bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_18px_40px_-24px_rgb(11_92_213/0.35)] ${
                  services.length % 2 === 1 && i === services.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-md border border-accent/15 bg-accent/[0.07] text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                    <Icon name={s.icon} className="size-6" strokeWidth={1.5} />
                  </span>
                  <span className="text-xs font-semibold tech text-muted">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{tr(s.title, lang)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{tr(s.text, lang)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= PROCESS (3D spektr fonida) ================= */}
      <section className="relative isolate overflow-hidden bg-band py-20 text-on-band lg:py-28">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <LabScene variant="spectrum" className="absolute inset-x-0 top-0 -z-10 h-[62%] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] lg:left-[38%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-band via-band/70 to-transparent" />
        <div className={wrap}>
          <div className="max-w-xl">
            <Eyebrow n="05" dark>
              {d.process.eyebrow}
            </Eyebrow>
            <h2 className={`${h2} text-white`}>{d.process.title}</h2>
            <p className="mt-4 font-mono text-xs text-on-band/45">LC-MS · t<sub>R</sub> × m/z × I</p>
          </div>
          <ol className="relative mt-16 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-36 lg:grid-cols-5">
            {d.process.steps.map((s, i) => (
              <li key={s.t} className="reveal relative bg-band-2/95 p-6 backdrop-blur">
                <span className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-md border border-signal/40 bg-signal/10 text-signal">
                    <Icon name={processIcons[i]} className="size-5" strokeWidth={1.5} />
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-signal/40 to-transparent" />
                  <span className="text-xs font-semibold tech text-on-band/40">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{s.t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-on-band/60">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= APPLICATIONS ================= */}
      <section id="applications" className="py-20 lg:py-28">
        <div className={wrap}>
          <div className="max-w-3xl">
            <Eyebrow n="06">{d.apps.eyebrow}</Eyebrow>
            <h2 className={h2}>{d.apps.title}</h2>
          </div>

          <ul className="mt-12 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-4">
            {industries.map((ind, i) => (
              <li
                key={ind.title.en}
                className={`reveal group relative overflow-hidden rounded-lg ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""} ${i === 3 ? "lg:col-span-2" : ""}`}
              >
                <Image
                  src={ind.image.src}
                  {...blurProps(ind.image.src)}
                  alt=""
                  fill
                  sizes={i === 0 ? "(min-width:1024px) 640px, 100vw" : "(min-width:1024px) 320px, 50vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-band/90 via-band/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white sm:p-6">
                  <div>
                    <span className="grid size-10 place-items-center rounded-md border border-white/20 bg-white/10 backdrop-blur">
                      <Icon name={ind.icon} className="size-5" strokeWidth={1.5} />
                    </span>
                    <h3 className={`mt-3 font-semibold tracking-tight ${i === 0 ? "text-3xl" : "text-xl"}`}>{tr(ind.title, lang)}</h3>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border border-white/30 transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-band">
                    <Icon name="arrowUp" className="size-4" />
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <ul className="mt-8 flex flex-wrap gap-2">
            {applications.map((a) => (
              <li key={a.en} className="rounded-md border border-line bg-card px-3.5 py-2 text-sm font-medium text-ink/80">
                {tr(a, lang)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="border-y border-line bg-card py-20 lg:py-28">
        <div className={`${wrap} grid items-center gap-14 lg:grid-cols-2 lg:gap-20`}>
          <div className="relative grid grid-cols-[1.4fr_1fr] grid-rows-[auto_auto] gap-4">
            <div className="relative row-span-2 aspect-[3/4] overflow-hidden rounded-lg">
              <Image src={photos.team.src} {...blurProps(photos.team.src)} alt={photos.team.alt} fill sizes="(min-width:1024px) 360px, 60vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={photos.beaker.src} {...blurProps(photos.beaker.src)} alt={photos.beaker.alt} fill sizes="(min-width:1024px) 240px, 40vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-accent p-5 text-accent-ink">
              <span className="eyebrow opacity-80">{d.about.est}</span>
              <span>
                <span className="block text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl">2022</span>
                <span className="mt-2 block text-sm opacity-80">{d.contact.addressV}</span>
              </span>
            </div>
          </div>

          <div>
            <Eyebrow n="07">{d.about.eyebrow}</Eyebrow>
            <h2 className={h2}>{d.about.title}</h2>
            <p className="mt-6 text-[17px] leading-relaxed text-muted">{d.about.p1}</p>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">{d.about.p2}</p>
            <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {d.about.points.map((p, i) => (
                <li key={p} className="flex items-center gap-3 rounded-lg border border-line bg-paper p-3.5 text-[15px] font-medium">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
                    <Icon name={pointIcons[i]} className="size-[18px]" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
              {[
                { t: d.about.mission, d: d.about.missionT },
                { t: d.about.vision, d: d.about.visionT },
              ].map((b) => (
                <div key={b.t}>
                  <h3 className="eyebrow text-accent">{b.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="py-20 lg:py-28">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20`}>
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow n="08">{d.faq.eyebrow}</Eyebrow>
            <h2 className={h2}>{d.faq.title}</h2>
            <p className="mt-5 max-w-sm text-muted">{d.faq.text}</p>
            <a
              href={contacts.phoneHref}
              className="mt-8 inline-flex items-center gap-3 rounded-md border border-line bg-card px-4 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              <Icon name="phone" className="size-4 text-accent" />
              {contacts.phone}
            </a>
          </div>
          <div className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-card">
            {d.faq.items.map((f, i) => (
              <details key={f.q} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-[17px] font-semibold tracking-tight transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-md border border-line transition-all duration-300 group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-accent-ink">
                    <Icon name="plus" className="size-4" />
                  </span>
                </summary>
                <p className="-mt-1 max-w-2xl px-6 pb-6 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="relative isolate overflow-hidden bg-band py-20 text-on-band lg:py-28">
        <Image src={photos.goggles.src} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-band via-band/95 to-band/80" />
        <div className={`${wrap} grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
          <div>
            <Eyebrow n="09" dark>
              {d.contact.eyebrow}
            </Eyebrow>
            <h2 className={`${h2} text-white`}>{d.contact.title}</h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-on-band/65">{d.contact.text}</p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                { icon: "phone", k: d.contact.phone, v: contacts.phone, href: contacts.phoneHref },
                { icon: "mail", k: d.contact.email, v: contacts.email, href: `mailto:${contacts.email}` },
                { icon: "pin", k: d.contact.address, v: d.contact.addressV },
                { icon: "clock", k: d.contact.hours, v: d.contact.hoursV },
              ].map((c) => (
                <li key={c.icon} className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-accent text-accent-ink">
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-on-band/55">{c.k}</span>
                    {c.href ? (
                      <a href={c.href} className="block truncate font-semibold text-white hover:text-signal">{c.v}</a>
                    ) : (
                      <span className="block font-semibold text-white">{c.v}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-ink">
            <LeadForm lang={lang} f={d.form} options={options} />
          </div>
        </div>
      </section>
    </>
  );
}
