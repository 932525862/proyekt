import { brands, categories, type Category } from "./catalog";
import type { Metadata } from "next";
import { alternates, company, getDictionary, locales, ogLocales, siteUrl, tr, type Locale } from "./i18n";
import { categoryMedia } from "./media";

/**
 * Sahifa metama'lumotlari: canonical + hreflang + to'liq Open Graph / Twitter.
 * (Next.js ichki sahifadagi openGraph'ni layout'niki bilan birlashtirmaydi — to'liq beramiz.)
 */
export function pageMetadata({ lang, path, title, description, keywords }: { lang: Locale; path: string; title: string; description: string; keywords?: string[] }): Metadata {
  const d = getDictionary(lang);
  const desc = clip(description);
  return {
    title,
    description: desc,
    keywords: keywords ?? d.meta.keywords,
    alternates: alternates(lang, path),
    openGraph: {
      title: `${title} | ${company.name}`,
      description: desc,
      type: "website",
      url: `/${lang}${path}`,
      siteName: company.name,
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
    },
    twitter: { card: "summary_large_image", title: `${title} | ${company.name}`, description: desc },
  };
}

/** Matnni so'z chegarasida qisqartiradi (meta description uchun ~160 belgi) */
export function clip(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]\s*$/, "") + "…";
}

const abs = (path: string) => `${siteUrl}${path}`;
const orgId = abs("/#organization");
const siteId = abs("/#website");

/** Faqat haqiqiy profil havolalari (bo'sh shablonlar emas) */
const profiles = [company.telegram, company.instagram, company.facebook].filter((u) => new URL(u).pathname.replace(/\//g, "").length > 0);

/** Har bir sahifada: kompaniya va sayt haqida */
export function organizationGraph(lang: Locale) {
  const d = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: company.brand,
        legalName: company.name,
        alternateName: company.name,
        url: abs(`/${lang}`),
        logo: { "@type": "ImageObject", url: abs("/brand/icon-512.png"), width: 512, height: 512 },
        image: abs("/brand/spectrum-peak-mark.png"),
        description: d.meta.description,
        slogan: d.meta.tagline,
        foundingDate: "2021",
        email: company.email,
        telephone: company.phone.replace(/\s/g, ""),
        address: { "@type": "PostalAddress", addressLocality: lang === "ru" ? "Ташкент" : lang === "uz" ? "Toshkent" : "Tashkent", addressCountry: "UZ" },
        areaServed: [{ "@type": "Country", name: "Uzbekistan" }, { "@type": "Place", name: "Central Asia" }],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: company.phone.replace(/\s/g, ""),
            email: company.email,
            areaServed: "UZ",
            availableLanguage: ["uz", "ru", "en"],
            hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
          },
        ],
        brand: brands.map((name) => ({ "@type": "Brand", name })),
        knowsAbout: categories.map((c) => tr(c.name, "en")),
        ...(profiles.length ? { sameAs: profiles } : {}),
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: siteUrl,
        name: company.name,
        inLanguage: locales.map((l) => (l === "uz" ? "uz-Latn" : l)),
        publisher: { "@id": orgId },
      },
    ],
  };
}

type Crumb = { name: string; path: string };
export const breadcrumbs = (items: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
});

export function faqPage(lang: Locale) {
  const d = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Katalog: barcha yo'nalishlar ro'yxati */
export function catalogPage(lang: Locale) {
  const d = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: d.catalog.title,
    description: d.catalog.text,
    url: abs(`/${lang}/products`),
    inLanguage: lang,
    isPartOf: { "@id": siteId },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categories.length,
      itemListElement: categories.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tr(c.name, lang),
        url: abs(`/${lang}/products/${c.slug}`),
        image: abs(categoryMedia[c.slug].src),
      })),
    },
  };
}

/** Yo'nalish sahifasi: modellar ro'yxati */
export function categoryPage(c: Category, lang: Locale, models: { name: string; image?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: tr(c.name, lang),
    description: tr(c.description, lang),
    url: abs(`/${lang}/products/${c.slug}`),
    inLanguage: lang,
    isPartOf: { "@id": siteId },
    about: { "@type": "Brand", name: c.brand },
    provider: { "@id": orgId },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: models.length,
      itemListElement: models.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${c.brand.split(" ")[0]} ${m.name}`,
        ...(m.image ? { image: abs(m.image) } : {}),
      })),
    },
  };
}

/** <script type="application/ld+json"> uchun xavfsiz serializatsiya */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

