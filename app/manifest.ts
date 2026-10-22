import type { MetadataRoute } from "next";
import { company, defaultLocale, getDictionary } from "@/lib/i18n";

export default function manifest(): MetadataRoute.Manifest {
  const d = getDictionary(defaultLocale);
  return {
    name: company.name,
    short_name: company.brand,
    description: d.meta.description,
    start_url: `/${defaultLocale}`,
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b5cd5",
    lang: defaultLocale,
    categories: ["business", "education", "productivity"],
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
