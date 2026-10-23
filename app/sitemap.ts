import type { MetadataRoute } from "next";
import { getCatalog, getFeatured } from "@/lib/data";
import { defaultLocale, locales, siteUrl } from "@/lib/i18n";
import { photos } from "@/lib/media";

/** Har bir sahifa uch tilda: hreflang muqobillari va sahifadagi asosiy rasmlar bilan */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  // build vaqti — sahifalar har deploy bilan yangilanadi
  const lastModified = new Date();
  const abs = (p: string) => (/^https?:/.test(p) ? p : `${siteUrl}${p}`);
  const [categories, featured] = await Promise.all([getCatalog(), getFeatured()]);
  const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter(Boolean) as string[])].map(abs);

  const pages: { path: string; priority: number; images: string[] }[] = [
    { path: "", priority: 1, images: uniq([photos.hero.src, ...featured.map((f) => f.product.image?.src)]) },
    { path: "/products", priority: 0.9, images: uniq(categories.map((c) => c.image?.src)) },
    ...categories.map((c) => ({
      path: `/products/${c.slug}`,
      priority: 0.8,
      images: uniq([c.image?.src, ...c.groups.flatMap((g) => g.products.map((p) => p.image?.src))]).slice(0, 20),
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
