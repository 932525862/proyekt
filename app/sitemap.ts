import type { MetadataRoute } from "next";
import { categories } from "@/lib/catalog";
import { defaultLocale, locales, siteUrl } from "@/lib/i18n";

/** Har bir sahifa uch tilda, hreflang muqobillari bilan */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/products", ...categories.map((c) => `/products/${c.slug}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
          "x-default": `${siteUrl}/${defaultLocale}${path}`,
        },
      },
    })),
  );
}
