import { notFound } from "next/navigation";
import { brands } from "@/lib/catalog";
import { company, getDictionary, isLocale, locales } from "@/lib/i18n";
import { featuredMedia } from "@/lib/media";
import { nbsp, ogSize, renderOg } from "@/lib/og";

export const alt = `${company.name} — analytical instruments, reagents and lab services`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  return renderOg({
    eyebrow: d.meta.tagline,
    title: `${d.hero.title1} ${d.hero.titleEm} ${d.hero.title2}`,
    subtitle: brands.map(nbsp).join(" · "),
    images: ["Spinsolve 90", "timsTOF Pro 2", "DIS 800i", "AZURA UHPLC"].map((n) => ({ src: featuredMedia[n].src, cover: featuredMedia[n].fit === "cover" })),
    footer: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" }[lang],
  });
}
