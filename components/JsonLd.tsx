import { ldJson } from "@/lib/seo";

/** Qidiruv tizimlari uchun tuzilmaviy ma'lumot (schema.org) */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(data) }} />;
}
