import { notFound } from "next/navigation";
import { categories, getCategory, modelCount } from "@/lib/catalog";
import { company, getDictionary, isLocale, locales, tr } from "@/lib/i18n";
import { categoryMedia } from "@/lib/media";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${company.name} — product line`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) => categories.map((c) => ({ lang, slug: c.slug })));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const c = getCategory(slug);
  if (!isLocale(lang) || !c) notFound();
  const d = getDictionary(lang);
  const media = categoryMedia[c.slug];
  return renderOg({
    eyebrow: `${c.brand} · ${modelCount(c)} ${d.catalog.models}`,
    title: tr(c.name, lang),
    subtitle: tr(c.short, lang),
    chips: c.standards?.slice(0, 4),
    images: [{ src: media.src, cover: media.fit === "cover" }],
    footer: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" }[lang],
  });
}
