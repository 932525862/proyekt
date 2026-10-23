import { notFound } from "next/navigation";
import { getCatalog, getCategory, modelCount } from "@/lib/data";
import { company, getDictionary, isLocale, locales, tr } from "@/lib/i18n";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${company.name} — product line`;
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const categories = await getCatalog();
  return locales.flatMap((lang) => categories.map((c) => ({ lang, slug: c.slug })));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const c = await getCategory(slug);
  if (!isLocale(lang) || !c) notFound();
  const d = getDictionary(lang);
  return renderOg({
    eyebrow: `${c.brand} · ${modelCount(c)} ${d.catalog.models}`,
    title: tr(c.name, lang),
    subtitle: tr(c.short, lang),
    chips: c.standards?.slice(0, 4),
    images: c.image ? [{ src: c.image.src, cover: c.image.fit === "cover" }] : [],
    footer: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" }[lang],
  });
}
