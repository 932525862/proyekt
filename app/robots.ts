import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  return {
    // /_next/ ochiq qoladi: Googlebot sahifani to'g'ri ko'rishi uchun CSS/JS kerak
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    // Yandex asosiy domenni shu yerdan oladi
    host: siteUrl,
  };
}
