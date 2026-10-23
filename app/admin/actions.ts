"use server";

import { and, asc, eq, max } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, ensureDb, schema } from "@/db";
import type { ImageFit, LeadStatus, Spec } from "@/db/schema";
import { slugify } from "@/db/seed";
import { requireAdmin } from "@/lib/admin-session";
import { adminLogin, adminPassword, createSessionToken, loginEnabled, safeEqual, SESSION_COOKIE } from "@/lib/auth";
import { CATALOG_TAG, SERVICES_TAG, SETTINGS_TAG } from "@/lib/data";
import type { T } from "@/lib/i18n";
import type { SpecKey } from "@/lib/specs";
import { saveImage } from "@/lib/upload";

export type FormState = { ok?: boolean; error?: string; message?: string };

/** Katalog o'zgardi: "catalog" tegi bilan keshlangan ma'lumot va sahifalar yangilanadi */
function catalogChanged() {
  updateTag(CATALOG_TAG);
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (f: FormData, k: string, d = 0) => (Number.isFinite(Number(f.get(k))) && str(f, k) !== "" ? Number(f.get(k)) : d);
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";
/** name_uz / name_ru / name_en → T (bo'sh tarjimalar o'zbekchadan olinadi) */
const tri = (f: FormData, k: string): T => {
  const uz = str(f, `${k}_uz`);
  return { uz, ru: str(f, `${k}_ru`) || uz, en: str(f, `${k}_en`) || uz };
};

/** Rasm: yangi fayl > qo'lda kiritilgan URL > o'chirish belgisi > avvalgisi */
async function resolveImage(f: FormData, folder: "products" | "categories", base: string, current: string | null) {
  const file = f.get("imageFile");
  if (file instanceof File && file.size > 0) return saveImage(file, folder, slugify(base));
  if (bool(f, "imageRemove")) return null;
  const url = str(f, "imageUrl");
  return url || current;
}

function done(message: string): FormState {
  return { ok: true, message };
}
function fail(e: unknown): FormState {
  return { ok: false, error: e instanceof Error ? e.message : String(e) };
}

/* ───────────────────────── Kirish ───────────────────────── */

export async function login(_: FormState, f: FormData): Promise<FormState> {
  if (!loginEnabled()) return { error: "Admin kirish o'chirilgan: serverda ADMIN_PASSWORD o'rnatilmagan." };
  const okUser = await safeEqual(str(f, "login"), adminLogin());
  const okPass = await safeEqual(String(f.get("password") ?? ""), adminPassword());
  if (!okUser || !okPass) {
    await new Promise((r) => setTimeout(r, 600)); // parol tanlashni sekinlashtirish
    return { error: "Login yoki parol noto'g'ri." };
  }
  const { token, maxAge } = await createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge });
  const next = str(f, "next");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ───────────────────────── Mahsulotlar ───────────────────────── */

function parseSpecs(f: FormData): Spec[] {
  const keys = f.getAll("spec_k").map(String);
  const uz = f.getAll("spec_uz").map((v) => String(v).trim());
  const ru = f.getAll("spec_ru").map((v) => String(v).trim());
  const en = f.getAll("spec_en").map((v) => String(v).trim());
  return keys.flatMap((k, i) => {
    if (!k || !uz[i]) return [];
    const r = ru[i] || uz[i];
    const e = en[i] || uz[i];
    return [{ k: k as SpecKey, v: r === uz[i] && e === uz[i] ? uz[i] : { uz: uz[i], ru: r, en: e } }];
  });
}

export async function saveProduct(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  await ensureDb();
  const id = str(f, "id");
  const name = str(f, "name");
  const groupId = str(f, "groupId");
  if (!name) return { error: "Mahsulot nomini kiriting." };
  const group = await db.select().from(schema.groups).where(eq(schema.groups.id, groupId)).get();
  if (!group) return { error: "Guruhni tanlang." };

  try {
    const existing = id ? await db.select().from(schema.products).where(eq(schema.products.id, id)).get() : undefined;
    if (id && !existing) return { error: "Mahsulot topilmadi (o'chirilgan bo'lishi mumkin)." };
    const featured = bool(f, "featured");
    const note = tri(f, "featuredNote");
    const values = {
      name,
      groupId,
      categorySlug: group.categorySlug,
      image: await resolveImage(f, "products", name, existing?.image ?? null),
      imageFit: (str(f, "imageFit") || "contain") as ImageFit,
      catNo: str(f, "catNo") || null,
      std: str(f, "std") || null,
      specs: parseSpecs(f),
      featured,
      featuredTag: featured ? str(f, "featuredTag") || null : null,
      featuredNote: featured && note.uz ? note : null,
      featuredSort: num(f, "featuredSort"),
      sort: num(f, "sort"),
      published: bool(f, "published"),
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(schema.products).set(values).where(eq(schema.products.id, existing.id));
      catalogChanged();
      refresh();
      return done("Saqlandi. Saytda darhol yangilandi.");
    }

    // yangi mahsulot: guruh oxiriga qo'shiladi (tartib berilmagan bo'lsa)
    let newId = `${group.categorySlug}--${slugify(name)}`;
    if (await db.select().from(schema.products).where(eq(schema.products.id, newId)).get()) newId += `-${Date.now().toString(36)}`;
    if (!str(f, "sort")) {
      const last = await db.select({ m: max(schema.products.sort) }).from(schema.products).where(eq(schema.products.categorySlug, group.categorySlug)).get();
      values.sort = (last?.m ?? -1) + 1;
    }
    await db.insert(schema.products).values({ id: newId, ...values, createdAt: new Date() });
    catalogChanged();
  } catch (e) {
    return fail(e);
  }
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(f: FormData) {
  await requireAdmin();
  await db.delete(schema.products).where(eq(schema.products.id, str(f, "id")));
  catalogChanged();
  if (str(f, "back")) redirect(str(f, "back"));
  refresh();
}

export async function toggleProduct(f: FormData) {
  await requireAdmin();
  const p = await db.select().from(schema.products).where(eq(schema.products.id, str(f, "id"))).get();
  if (!p) return;
  const field = str(f, "field") === "featured" ? "featured" : "published";
  await db.update(schema.products).set({ [field]: !p[field], updatedAt: new Date() }).where(eq(schema.products.id, p.id));
  catalogChanged();
  refresh();
}

export async function duplicateProduct(f: FormData) {
  await requireAdmin();
  const p = await db.select().from(schema.products).where(eq(schema.products.id, str(f, "id"))).get();
  if (!p) return;
  const id = `${p.id}-copy-${Date.now().toString(36)}`;
  await db.insert(schema.products).values({ ...p, id, name: `${p.name} (nusxa)`, published: false, featured: false, sort: p.sort + 1, createdAt: new Date(), updatedAt: new Date() });
  catalogChanged();
  redirect(`/admin/products/${encodeURIComponent(id)}`);
}

/* ───────────────────────── Yo'nalishlar ───────────────────────── */

export async function saveCategory(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  await ensureDb();
  const original = str(f, "original");
  const slug = original || str(f, "slug").toLowerCase();
  const name = tri(f, "name");
  if (!/^[a-z0-9][a-z0-9-]{1,48}$/.test(slug)) return { error: "Manzil (slug) faqat lotin kichik harflar, raqam va '-' dan iborat bo'lsin (masalan: gas-chromatography)." };
  if (!name.uz) return { error: "Yo'nalish nomini kiriting." };
  if (!str(f, "brand")) return { error: "Ishlab chiqaruvchini kiriting." };

  try {
    const existing = await db.select().from(schema.categories).where(eq(schema.categories.slug, slug)).get();
    if (!original && existing) return { error: `"${slug}" manzili band. Boshqa manzil tanlang.` };
    const values = {
      sort: num(f, "sort"),
      symbol: str(f, "symbol"),
      brand: str(f, "brand"),
      name,
      short: tri(f, "short"),
      description: tri(f, "description"),
      standards: str(f, "standards")
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      image: await resolveImage(f, "categories", slug, existing?.image ?? null),
      imageFit: (str(f, "imageFit") || "contain") as ImageFit,
      imageAlt: str(f, "imageAlt") || null,
      published: bool(f, "published"),
      updatedAt: new Date(),
    };
    if (existing) {
      await db.update(schema.categories).set(values).where(eq(schema.categories.slug, slug));
      catalogChanged();
      refresh();
      return done("Saqlandi. Saytda darhol yangilandi.");
    }
    await db.insert(schema.categories).values({ slug, ...values });
    // yangi yo'nalish uchun bitta asosiy guruh
    await db.insert(schema.groups).values({ id: `${slug}--g1`, categorySlug: slug, name: { uz: "Asosiy", ru: "Основные", en: "Main" }, sort: 0 });
    catalogChanged();
  } catch (e) {
    return fail(e);
  }
  redirect(`/admin/categories/${slug}?created=1`);
}

export async function deleteCategory(f: FormData) {
  await requireAdmin();
  const slug = str(f, "slug");
  await db.batch([
    db.delete(schema.products).where(eq(schema.products.categorySlug, slug)),
    db.delete(schema.groups).where(eq(schema.groups.categorySlug, slug)),
    db.delete(schema.categories).where(eq(schema.categories.slug, slug)),
  ]);
  catalogChanged();
  redirect("/admin/categories?deleted=1");
}

export async function saveGroup(f: FormData) {
  await requireAdmin();
  const categorySlug = str(f, "categorySlug");
  const name = tri(f, "name");
  if (!name.uz || !categorySlug) return;
  const id = str(f, "id");
  if (id) {
    await db.update(schema.groups).set({ name, sort: num(f, "sort") }).where(eq(schema.groups.id, id));
  } else {
    const last = await db.select({ m: max(schema.groups.sort) }).from(schema.groups).where(eq(schema.groups.categorySlug, categorySlug)).get();
    await db.insert(schema.groups).values({ id: `${categorySlug}--${slugify(name.uz)}-${Date.now().toString(36)}`, categorySlug, name, sort: (last?.m ?? -1) + 1 });
  }
  catalogChanged();
  refresh();
}

export async function deleteGroup(f: FormData) {
  await requireAdmin();
  const id = str(f, "id");
  const used = await db.select({ id: schema.products.id }).from(schema.products).where(eq(schema.products.groupId, id)).limit(1).get();
  if (used) return; // UI'da ham bloklangan: avval mahsulotlarni ko'chirish kerak
  await db.delete(schema.groups).where(eq(schema.groups.id, id));
  catalogChanged();
  refresh();
}

/* ───────────────────────── Zayavkalar ───────────────────────── */

export async function updateLead(f: FormData) {
  await requireAdmin();
  const id = Number(f.get("id"));
  const status = str(f, "status") as LeadStatus;
  const patch: Partial<typeof schema.leads.$inferInsert> = { updatedAt: new Date() };
  if (["new", "in_progress", "done", "archived"].includes(status)) patch.status = status;
  if (f.has("note")) patch.note = str(f, "note") || null;
  await db.update(schema.leads).set(patch).where(eq(schema.leads.id, id));
  refresh();
}

export async function deleteLead(f: FormData) {
  await requireAdmin();
  await db.delete(schema.leads).where(eq(schema.leads.id, Number(f.get("id"))));
  redirect("/admin/leads?deleted=1");
}

/* ───────────────────────── Sozlamalar ───────────────────────── */

export async function saveContacts(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  await ensureDb();
  const value = Object.fromEntries(["phone", "email", "telegram", "instagram", "facebook"].map((k) => [k, str(f, k)]));
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) return { error: "Email manzili noto'g'ri." };
  for (const k of ["telegram", "instagram", "facebook"]) {
    if (value[k] && !/^https?:\/\//.test(value[k])) return { error: `${k} havolasi https:// bilan boshlanishi kerak.` };
  }
  await db.insert(schema.settings).values({ key: "contacts", value }).onConflictDoUpdate({ target: schema.settings.key, set: { value } });
  updateTag(SETTINGS_TAG);
  refresh();
  return done("Kontaktlar saqlandi. Saytda darhol yangilandi.");
}

/** Statusni bir bosishda o'zgartirish (ro'yxatdan) */
export async function quickLeadStatus(f: FormData) {
  await requireAdmin();
  const status = str(f, "status") as LeadStatus;
  await db
    .update(schema.leads)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(schema.leads.id, Number(f.get("id")))));
  refresh();
}

/* ───────────────────────── Xizmatlar ───────────────────────── */

export async function saveService(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  await ensureDb();
  const id = str(f, "id");
  const title = tri(f, "title");
  const text = tri(f, "text");
  const icon = str(f, "icon");
  if (!title.uz) return { error: "Xizmat nomini kiriting (o'zbekcha)." };
  if (!text.uz) return { error: "Qisqa tavsifni kiriting (o'zbekcha)." };
  if (!icon) return { error: "Ikonni tanlang." };
  try {
    const values = { icon, title, text, published: bool(f, "published"), updatedAt: new Date() } as const;
    if (id) {
      await db.update(schema.services).set({ ...values, sort: num(f, "sort") }).where(eq(schema.services.id, id));
      updateTag(SERVICES_TAG);
      refresh();
      return done("Saqlandi. Saytda darhol yangilandi.");
    }
    const last = await db.select({ m: max(schema.services.sort) }).from(schema.services).get();
    const sort = str(f, "sort") ? num(f, "sort") : (last?.m ?? -1) + 1;
    await db.insert(schema.services).values({ id: `svc-${slugify(title.uz)}-${Date.now().toString(36)}`, ...values, sort });
    updateTag(SERVICES_TAG);
  } catch (e) {
    return fail(e);
  }
  redirect("/admin/services?saved=1");
}

export async function deleteService(f: FormData) {
  await requireAdmin();
  await db.delete(schema.services).where(eq(schema.services.id, str(f, "id")));
  updateTag(SERVICES_TAG);
  if (str(f, "back")) redirect(str(f, "back"));
  refresh();
}

export async function toggleService(f: FormData) {
  await requireAdmin();
  const s = await db.select().from(schema.services).where(eq(schema.services.id, str(f, "id"))).get();
  if (!s) return;
  await db.update(schema.services).set({ published: !s.published, updatedAt: new Date() }).where(eq(schema.services.id, s.id));
  updateTag(SERVICES_TAG);
  refresh();
}

/** Tartibni bir pog'ona yuqoriga/pastga siljitish (qo'shni xizmat bilan almashtirish) */
export async function moveService(f: FormData) {
  await requireAdmin();
  const list = await db.select().from(schema.services).orderBy(asc(schema.services.sort));
  const i = list.findIndex((s) => s.id === str(f, "id"));
  const j = str(f, "dir") === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;
  // tartib raqamlarini ketma-ket qilib, ikkisini almashtiramiz
  const order = list.map((s) => s.id);
  [order[i], order[j]] = [order[j], order[i]];
  const [first, ...rest] = order.map((id, k) => db.update(schema.services).set({ sort: k }).where(eq(schema.services.id, id)));
  await db.batch([first, ...rest]);
  updateTag(SERVICES_TAG);
  refresh();
}

/** Bo'lim sarlavhasi va kirish matni; bo'sh qoldirilsa — standart matn qaytadi */
export async function saveServicesSection(_: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  await ensureDb();
  const raw = (k: string) => ({ uz: str(f, `${k}_uz`), ru: str(f, `${k}_ru`), en: str(f, `${k}_en`) });
  const value = { title: raw("title"), text: raw("text") };
  await db.insert(schema.settings).values({ key: "servicesSection", value }).onConflictDoUpdate({ target: schema.settings.key, set: { value } });
  updateTag(SERVICES_TAG);
  refresh();
  return done("Bo'lim matni saqlandi. Saytda darhol yangilandi.");
}
