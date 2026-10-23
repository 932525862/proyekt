import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { T } from "@/lib/i18n";
import type { SpecKey } from "@/lib/specs";

/** Spetsifikatsiya qatori: yorliq kaliti + qiymat (oddiy matn yoki uch tilli) */
export type Spec = { k: SpecKey; v: string | T };
export type ImageFit = "contain" | "cover";

/** Mahsulot yo'nalishlari (NMR, mass-spektrometriya, ...) */
export const categories = sqliteTable("categories", {
  slug: text("slug").primaryKey(),
  sort: integer("sort").notNull().default(0),
  symbol: text("symbol").notNull().default(""),
  brand: text("brand").notNull(),
  name: text("name", { mode: "json" }).$type<T>().notNull(),
  short: text("short", { mode: "json" }).$type<T>().notNull(),
  description: text("description", { mode: "json" }).$type<T>().notNull(),
  standards: text("standards", { mode: "json" }).$type<string[]>().notNull(),
  image: text("image"),
  imageFit: text("image_fit").$type<ImageFit>().notNull().default("contain"),
  imageAlt: text("image_alt"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
});

/** Yo'nalish ichidagi model guruhlari (timsTOF, QTOF, Analitik tarozilar, ...) */
export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  categorySlug: text("category_slug").notNull(),
  name: text("name", { mode: "json" }).$type<T>().notNull(),
  sort: integer("sort").notNull().default(0),
});

/** Mahsulotlar (modellar) */
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  categorySlug: text("category_slug").notNull(),
  groupId: text("group_id").notNull(),
  name: text("name").notNull(),
  image: text("image"),
  imageFit: text("image_fit").$type<ImageFit>().notNull().default("contain"),
  catNo: text("cat_no"),
  std: text("std"),
  specs: text("specs", { mode: "json" }).$type<Spec[]>().notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  featuredTag: text("featured_tag"),
  featuredNote: text("featured_note", { mode: "json" }).$type<T | null>(),
  featuredSort: integer("featured_sort").notNull().default(0),
  sort: integer("sort").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
});

/** "Xizmatlar" bo'limidagi kartochkalar */
export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  icon: text("icon").notNull(),
  title: text("title", { mode: "json" }).$type<T>().notNull(),
  text: text("text", { mode: "json" }).$type<T>().notNull(),
  sort: integer("sort").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
});

export type LeadStatus = "new" | "in_progress" | "done" | "archived";

/** Saytdagi formadan kelgan so'rovlar (zayavkalar) */
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  name: text("name").notNull(),
  company: text("company"),
  phone: text("phone").notNull(),
  email: text("email"),
  interest: text("interest"),
  model: text("model"),
  message: text("message"),
  lang: text("lang"),
  status: text("status").$type<LeadStatus>().notNull().default("new"),
  note: text("note"),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
});

/** Kalit-qiymat sozlamalar (kontaktlar va tizim belgilari) */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).$type<unknown>(),
});

/** Jadvallarni yaratish (bo'lmasa) — alohida migratsiya vositasisiz, birinchi murojaatda bajariladi */
export const ddl = [
  `CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY, sort INTEGER NOT NULL DEFAULT 0, symbol TEXT NOT NULL DEFAULT '', brand TEXT NOT NULL,
    name TEXT NOT NULL, short TEXT NOT NULL, description TEXT NOT NULL, standards TEXT NOT NULL DEFAULT '[]',
    image TEXT, image_fit TEXT NOT NULL DEFAULT 'contain', image_alt TEXT, published INTEGER NOT NULL DEFAULT 1, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY, category_slug TEXT NOT NULL, name TEXT NOT NULL, sort INTEGER NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, category_slug TEXT NOT NULL, group_id TEXT NOT NULL, name TEXT NOT NULL,
    image TEXT, image_fit TEXT NOT NULL DEFAULT 'contain', cat_no TEXT, std TEXT, specs TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0, featured_tag TEXT, featured_note TEXT, featured_sort INTEGER NOT NULL DEFAULT 0, sort INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1, created_at INTEGER, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT, created_at INTEGER NOT NULL, name TEXT NOT NULL, company TEXT, phone TEXT NOT NULL,
    email TEXT, interest TEXT, model TEXT, message TEXT, lang TEXT, status TEXT NOT NULL DEFAULT 'new', note TEXT, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`,
  `CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY, icon TEXT NOT NULL, title TEXT NOT NULL, text TEXT NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 1, updated_at INTEGER)`,
  `CREATE INDEX IF NOT EXISTS products_category ON products (category_slug, sort)`,
  `CREATE INDEX IF NOT EXISTS groups_category ON groups (category_slug, sort)`,
  `CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at)`,
];
