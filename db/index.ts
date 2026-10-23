import "server-only";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { seedRows, seedServiceRows } from "./seed";

/**
 * Ma'lumotlar bazasi ulanishi.
 *  - Turso / libSQL (production): TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) yoki DATABASE_URL
 *  - Vercel'da baza ulanmagan bo'lsa: /tmp dagi vaqtinchalik fayl (sayt ishlaydi, o'zgarishlar saqlanmaydi)
 *  - Lokal: .data/spectrum.db (hech narsa o'rnatish shart emas)
 */
const remoteUrl = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
const onVercel = Boolean(process.env.VERCEL);

function localFileUrl() {
  const dir = onVercel ? "/tmp" : join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  return `file:${join(dir, "spectrum.db")}`;
}

/** Doimiy (production) baza ulanganmi — admin panel ogohlantirishi uchun */
export const isPersistent = Boolean(remoteUrl) || !onVercel;

const client = createClient({ url: remoteUrl ?? localFileUrl(), authToken: process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN });
export const db = drizzle(client, { schema });

let ready: Promise<void> | undefined;

/** Jadvallarni yaratadi va bo'sh bazaga boshlang'ich ma'lumotni (hozirgi katalog) yozadi */
export function ensureDb() {
  ready ??= (async () => {
    for (const stmt of schema.ddl) await client.execute(stmt);
    const flags = new Set((await db.select({ key: schema.settings.key }).from(schema.settings)).map((r) => r.key));
    const stamp = new Date().toISOString();
    // Bir nechta build jarayoni bir vaqtda kelsa ham xavfsiz: barqaror ID + "conflict do nothing".
    // Har bir to'plam bir marta yoziladi — keyin admin o'chirgan narsa qayta paydo bo'lmaydi.
    if (!flags.has("seeded")) {
      const rows = seedRows();
      await db.batch([
        db.insert(schema.categories).values(rows.categories).onConflictDoNothing(),
        db.insert(schema.groups).values(rows.groups).onConflictDoNothing(),
        ...chunk(rows.products, 50).map((part) => db.insert(schema.products).values(part).onConflictDoNothing()),
        db.insert(schema.settings).values({ key: "seeded", value: stamp }).onConflictDoNothing(),
      ]);
    }
    if (!flags.has("seeded:services")) {
      await db.batch([
        db.insert(schema.services).values(seedServiceRows()).onConflictDoNothing(),
        db.insert(schema.settings).values({ key: "seeded:services", value: stamp }).onConflictDoNothing(),
      ]);
    }
  })().catch((e) => {
    ready = undefined;
    throw e;
  });
  return ready;
}

function chunk<X>(xs: X[], n: number) {
  return Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n));
}

export { schema };
