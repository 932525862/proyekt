import { seedCategories, seedFeatured, seedServices } from "@/lib/catalog";
import type { T } from "@/lib/i18n";
import { categoryMedia, featuredMedia, modelImage } from "@/lib/media";
import { modelSpecs } from "@/lib/specs";
import type { categories, groups, products, services } from "./schema";

/** URL va ID uchun xavfsiz qisqa nom */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "item";

const tri = (v: T | string): T => (typeof v === "string" ? { uz: v, ru: v, en: v } : v);

/** Hozirgi kod ichidagi katalogni bazadagi qatorlarga aylantiradi (barqaror ID'lar bilan) */
export function seedRows() {
  const now = new Date();
  const cats: (typeof categories.$inferInsert)[] = [];
  const grps: (typeof groups.$inferInsert)[] = [];
  const prods: (typeof products.$inferInsert)[] = [];

  for (const c of seedCategories) {
    const media = categoryMedia[c.slug];
    cats.push({
      slug: c.slug,
      sort: c.number,
      symbol: c.symbol,
      brand: c.brand,
      name: c.name,
      short: c.short,
      description: c.description,
      standards: c.standards ?? [],
      image: media?.src ?? null,
      imageFit: media?.fit ?? "contain",
      imageAlt: media?.alt ?? null,
      published: true,
      updatedAt: now,
    });
    let sort = 0;
    c.groups.forEach((g, gi) => {
      const groupId = `${c.slug}--g${gi + 1}`;
      grps.push({ id: groupId, categorySlug: c.slug, name: tri(g.name), sort: gi });
      for (const m of g.models) {
        const spec = modelSpecs[m];
        const feat = seedFeatured.findIndex((f) => f.model === m && f.slug === c.slug);
        const img = modelImage(c, g.name, m) ?? (feat >= 0 ? featuredMedia[seedFeatured[feat].name] : undefined);
        prods.push({
          id: `${c.slug}--${slugify(m)}`,
          categorySlug: c.slug,
          groupId,
          name: m,
          image: img?.src ?? null,
          imageFit: img?.fit ?? "contain",
          catNo: spec?.cat ?? null,
          std: spec?.std ?? null,
          specs: (spec?.specs ?? []).map(([k, v]) => ({ k, v })),
          featured: feat >= 0,
          featuredTag: feat >= 0 ? seedFeatured[feat].tag : null,
          featuredNote: feat >= 0 ? seedFeatured[feat].spec : null,
          featuredSort: feat >= 0 ? feat : 0,
          sort: sort++,
          published: true,
          createdAt: now,
          updatedAt: now,
        });
      }
    });
  }
  return { categories: cats, groups: grps, products: prods };
}

/** Xizmatlar — barqaror ID bilan (svc-01, svc-02, ...) */
export function seedServiceRows(): (typeof services.$inferInsert)[] {
  const now = new Date();
  return seedServices.map((s, i) => ({ id: `svc-${String(i + 1).padStart(2, "0")}`, icon: s.icon, title: s.title, text: s.text, sort: i, published: true, updatedAt: now }));
}
