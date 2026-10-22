import type { MetadataRoute } from "next";
import { categories, featured } from "@/lib/catalog";
import { defaultLocale, locales, siteUrl } from "@/lib/i18n";
import { categoryMedia, featuredMedia, modelImage, photos } from "@/lib/media";

/** Har bir sahifa uch tilda: hreflang muqobillari va sahifadagi asosiy rasmlar bilan */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  // build vaqti — sahifalar har deploy bilan yangilanadi
  const lastModified = new Date();
  const abs = (p: string) => `${siteUrl}${p}`;
  const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter(Boolean) as string[])].map(abs);

  const pages: { path: string; priority: number; images: string[] }[] = [
    { path: "", priority: 1, images: uniq([photos.hero.src, ...featured.map((f) => featuredMedia[f.name]?.src)]) },
    { path: "/products", priority: 0.9, images: uniq(categories.map((c) => categoryMedia[c.slug].src)) },
    ...categories.map((c) => ({
      path: `/products/${c.slug}`,
      priority: 0.8,
      images: uniq([categoryMedia[c.slug].src, ...c.groups.flatMap((g) => g.models.map((m) => modelImage(c, g.name, m)?.src))]).slice(0, 20),
    })),
  ];

  return pages.flatMap(({ path, priority, images }) =>
    locales.map((lang) => ({
      url: abs(`/${lang}${path}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
      images,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, abs(`/${l}${path}`)])),
          "x-default": abs(`/${defaultLocale}${path}`),
        },
      },
    })),
  );
}
