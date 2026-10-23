import "server-only";
import { and, asc, count, desc, eq, gte, like, or, sql, type SQL } from "drizzle-orm";
import { connection } from "next/server";
import { db, ensureDb, schema } from "@/db";
import type { LeadStatus } from "@/db/schema";

/** Admin uchun: keshsiz, yashirilganlar ham ko'rinadi. connection() — har doim so'rov vaqtida bajariladi */
async function ready() {
  await connection();
  await ensureDb();
}

export async function adminCategories() {
  await ready();
  const [cats, counts] = await Promise.all([
    db.select().from(schema.categories).orderBy(asc(schema.categories.sort)),
    db.select({ slug: schema.products.categorySlug, n: count() }).from(schema.products).groupBy(schema.products.categorySlug),
  ]);
  return cats.map((c) => ({ ...c, productCount: counts.find((x) => x.slug === c.slug)?.n ?? 0 }));
}

export async function adminGroups() {
  await ready();
  return db.select().from(schema.groups).orderBy(asc(schema.groups.categorySlug), asc(schema.groups.sort));
}

export async function adminCategory(slug: string) {
  await ready();
  const [cat, groups, counts] = await Promise.all([
    db.select().from(schema.categories).where(eq(schema.categories.slug, slug)).get(),
    db.select().from(schema.groups).where(eq(schema.groups.categorySlug, slug)).orderBy(asc(schema.groups.sort)),
    db.select({ id: schema.products.groupId, n: count() }).from(schema.products).where(eq(schema.products.categorySlug, slug)).groupBy(schema.products.groupId),
  ]);
  if (!cat) return undefined;
  return { ...cat, groups: groups.map((g) => ({ ...g, productCount: counts.find((x) => x.id === g.id)?.n ?? 0 })) };
}

export async function adminProducts({ category, q, status }: { category?: string; q?: string; status?: string }) {
  await ready();
  const where: SQL[] = [];
  if (category) where.push(eq(schema.products.categorySlug, category));
  if (q) where.push(or(like(schema.products.name, `%${q}%`), like(schema.products.catNo, `%${q}%`))!);
  if (status === "hidden") where.push(eq(schema.products.published, false));
  if (status === "featured") where.push(eq(schema.products.featured, true));
  const [rows, cats] = await Promise.all([
    db.select().from(schema.products).where(where.length ? and(...where) : undefined).orderBy(asc(schema.products.sort)),
    db.select({ slug: schema.categories.slug, sort: schema.categories.sort }).from(schema.categories),
  ]);
  // saytdagi kabi: yo'nalishlar tartibi, so'ng mahsulot tartibi
  const order = new Map(cats.map((c) => [c.slug, c.sort]));
  return rows.sort((a, b) => (order.get(a.categorySlug) ?? 999) - (order.get(b.categorySlug) ?? 999) || a.sort - b.sort);
}

export async function adminProduct(id: string) {
  await ready();
  return db.select().from(schema.products).where(eq(schema.products.id, id)).get();
}

export const leadStatuses: { value: LeadStatus; label: string; tone: string }[] = [
  { value: "new", label: "Yangi", tone: "bg-accent text-white" },
  { value: "in_progress", label: "Jarayonda", tone: "bg-amber-500 text-white" },
  { value: "done", label: "Bajarildi", tone: "bg-emerald-600 text-white" },
  { value: "archived", label: "Arxiv", tone: "bg-sunk text-muted" },
];

export async function adminLeads({ status, q }: { status?: string; q?: string }) {
  await ready();
  const where: SQL[] = [];
  if (status && status !== "all") where.push(eq(schema.leads.status, status as LeadStatus));
  if (q)
    where.push(
      or(
        like(schema.leads.name, `%${q}%`),
        like(schema.leads.phone, `%${q}%`),
        like(schema.leads.company, `%${q}%`),
        like(schema.leads.email, `%${q}%`),
        like(schema.leads.model, `%${q}%`),
      )!,
    );
  return db.select().from(schema.leads).where(where.length ? and(...where) : undefined).orderBy(desc(schema.leads.createdAt)).limit(500);
}

export async function adminLead(id: number) {
  await ready();
  return db.select().from(schema.leads).where(eq(schema.leads.id, id)).get();
}

export async function leadCounts() {
  await ready();
  const rows = await db.select({ status: schema.leads.status, n: count() }).from(schema.leads).groupBy(schema.leads.status);
  const by = Object.fromEntries(rows.map((r) => [r.status, r.n])) as Partial<Record<LeadStatus, number>>;
  const week = await db
    .select({ n: count() })
    .from(schema.leads)
    .where(gte(schema.leads.createdAt, new Date(Date.now() - 7 * 864e5)))
    .get();
  return { ...by, total: rows.reduce((n, r) => n + r.n, 0), week: week?.n ?? 0 };
}

export async function productStats() {
  await ready();
  const r = await db
    .select({
      total: count(),
      hidden: sql<number>`sum(case when ${schema.products.published} = 0 then 1 else 0 end)`,
      featured: sql<number>`sum(case when ${schema.products.featured} = 1 then 1 else 0 end)`,
      noImage: sql<number>`sum(case when ${schema.products.image} is null then 1 else 0 end)`,
    })
    .from(schema.products)
    .get();
  return { total: r?.total ?? 0, hidden: Number(r?.hidden ?? 0), featured: Number(r?.featured ?? 0), noImage: Number(r?.noImage ?? 0) };
}

export async function savedContacts() {
  await ready();
  const row = await db.select().from(schema.settings).where(eq(schema.settings.key, "contacts")).get();
  return (row?.value ?? {}) as Record<string, string>;
}

export async function adminServices() {
  await ready();
  return db.select().from(schema.services).orderBy(asc(schema.services.sort));
}

export async function adminService(id: string) {
  await ready();
  return db.select().from(schema.services).where(eq(schema.services.id, id)).get();
}

export async function savedServicesSection() {
  await ready();
  const row = await db.select().from(schema.settings).where(eq(schema.settings.key, "servicesSection")).get();
  return (row?.value ?? {}) as { title?: { uz: string; ru: string; en: string }; text?: { uz: string; ru: string; en: string } };
}
