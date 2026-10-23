import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, ensureDb, schema } from "@/db";
import type { ImageFit, Spec } from "@/db/schema";
import { company, type T } from "./i18n";
import type { Media } from "./media";

/** Saytda ko'rsatiladigan katalog shakli (bazadan yig'iladi) */
export type Product = {
  id: string;
  name: string;
  categorySlug: string;
  groupId: string;
  image?: Media;
  catNo?: string;
  std?: string;
  specs: Spec[];
  featured: boolean;
  featuredTag?: string;
  featuredNote?: T;
};
export type Group = { id: string; name: T; products: Product[] };
export type Category = {
  slug: string;
  number: number;
  symbol: string;
  brand: string;
  name: T;
  short: T;
  description: T;
  standards: string[];
  image?: Media;
  groups: Group[];
};

export const CATALOG_TAG = "catalog";
export const SERVICES_TAG = "services";
export const SETTINGS_TAG = "settings";

const media = (src: string | null, fit: ImageFit, alt: string): Media | undefined => (src ? { src, fit, alt } : undefined);
const brandShort = (brand: string) => brand.split(/[\s·]/)[0];

/** Faqat e'lon qilingan yo'nalishlar va mahsulotlar — sayt uchun */
export async function getCatalog(): Promise<Category[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("max");
  await ensureDb();
  const [cats, grps, prods] = await Promise.all([
    db.select().from(schema.categories).where(eq(schema.categories.published, true)).orderBy(asc(schema.categories.sort)),
    db.select().from(schema.groups).orderBy(asc(schema.groups.sort)),
    db.select().from(schema.products).where(eq(schema.products.published, true)).orderBy(asc(schema.products.sort)),
  ]);
  return cats.map((c) => ({
    slug: c.slug,
    number: c.sort,
    symbol: c.symbol,
    brand: c.brand,
    name: c.name,
    short: c.short,
    description: c.description,
    standards: c.standards,
    image: media(c.image, c.imageFit, c.imageAlt ?? `${c.brand} — ${c.name.en}`),
    groups: grps
      .filter((g) => g.categorySlug === c.slug)
      .map((g) => ({
        id: g.id,
        name: g.name,
        products: prods
          .filter((p) => p.groupId === g.id)
          .map((p) => ({
            id: p.id,
            name: p.name,
            categorySlug: p.categorySlug,
            groupId: p.groupId,
            image: media(p.image, p.imageFit, `${brandShort(c.brand)} ${p.name}`),
            catNo: p.catNo ?? undefined,
            std: p.std ?? undefined,
            specs: p.specs,
            featured: p.featured,
            featuredTag: p.featuredTag ?? undefined,
            featuredNote: p.featuredNote ?? undefined,
          })),
      }))
      .filter((g) => g.products.length > 0),
  }));
}

export async function getCategory(slug: string) {
  return (await getCatalog()).find((c) => c.slug === slug);
}

export const modelCount = (c: Category) => c.groups.reduce((n, g) => n + g.products.length, 0);
export const totalModels = (cats: Category[]) => cats.reduce((n, c) => n + modelCount(c), 0);

/** "Tanlangan uskunalar" — bosh sahifa */
export async function getFeatured() {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("max");
  await ensureDb();
  const cats = await getCatalog();
  const rows = await db.select().from(schema.products).where(eq(schema.products.featured, true)).orderBy(asc(schema.products.featuredSort));
  return rows.flatMap((p) => {
    const c = cats.find((x) => x.slug === p.categorySlug);
    const product = c?.groups.flatMap((g) => g.products).find((x) => x.id === p.id);
    return c && product ? [{ product, category: c }] : [];
  });
}

/** Kontakt sozlamalari (admin paneldan o'zgartiriladi) */
export type Contacts = { phone: string; email: string; telegram: string; instagram: string; facebook: string };

export async function getContacts(): Promise<Contacts & { phoneHref: string }> {
  "use cache";
  cacheTag(SETTINGS_TAG);
  cacheLife("max");
  await ensureDb();
  const row = await db.select().from(schema.settings).where(eq(schema.settings.key, "contacts")).get();
  const saved = (row?.value ?? {}) as Partial<Contacts>;
  const c: Contacts = {
    phone: saved.phone || company.phone,
    email: saved.email || company.email,
    telegram: saved.telegram || company.telegram,
    instagram: saved.instagram || company.instagram,
    facebook: saved.facebook || company.facebook,
  };
  return { ...c, phoneHref: `tel:${c.phone.replace(/[^\d+]/g, "")}` };
}

/** "Xizmatlar" bo'limi: e'lon qilingan kartochkalar */
export async function getServices() {
  "use cache";
  cacheTag(SERVICES_TAG);
  cacheLife("max");
  await ensureDb();
  return db
    .select({ id: schema.services.id, icon: schema.services.icon, title: schema.services.title, text: schema.services.text })
    .from(schema.services)
    .where(eq(schema.services.published, true))
    .orderBy(asc(schema.services.sort));
}

/** Bo'lim sarlavhasi va kirish matni (admin o'zgartirgan bo'lsa). Bo'sh til — lug'atdagi standart matn */
export type ServicesSection = { title?: T; text?: T };

export async function getServicesSection(): Promise<ServicesSection> {
  "use cache";
  cacheTag(SERVICES_TAG);
  cacheLife("max");
  await ensureDb();
  const row = await db.select().from(schema.settings).where(eq(schema.settings.key, "servicesSection")).get();
  return (row?.value ?? {}) as ServicesSection;
}
