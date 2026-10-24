import type { Category } from "./data";
import { tr, type Locale } from "./i18n";

export type SearchEntry = {
  slug: string;
  category: string;
  brand: string;
  products: { name: string; group: string; cat?: string }[];
};

/** Qidiruv indeksi: har bir yo'nalish va uning mahsulotlari (tanlangan tilda) */
export const searchEntries = (categories: Category[], lang: Locale): SearchEntry[] =>
  categories.map((c) => ({
    slug: c.slug,
    category: tr(c.name, lang),
    brand: c.brand,
    products: c.groups.flatMap((g) => g.products.map((p) => ({ name: p.name, group: tr(g.name, lang), cat: p.catNo }))),
  }));

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

export function searchCatalog(entries: SearchEntry[], query: string) {
  const needle = norm(query);
  if (!needle) return { cats: [], prods: [] };
  const cats = entries.filter((e) => norm(`${e.category} ${e.brand}`).includes(needle));
  const prods = entries.flatMap((e) =>
    e.products
      .filter((p) => norm(`${p.name} ${p.cat ?? ""} ${p.group}`).includes(needle))
      .map((p) => ({ ...p, slug: e.slug, category: e.category })),
  );
  return { cats, prods };
}
