import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { put } from "@vercel/blob";
import sharp from "sharp";

/** Vercel Blob ulanganmi (production'da rasm yuklash uchun kerak) */
export const blobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
/** Rasm yuklash mumkinmi: Blob bor yoki lokal muhit (.data/uploads ga yoziladi) */
export const uploadsEnabled = blobEnabled || !process.env.VERCEL;

const MAX_BYTES = 8 * 1024 * 1024;
/** Lokal yuklangan rasmlar papkasi — app/uploads/[...path]/route.ts orqali beriladi */
export const uploadsDir = join(process.cwd(), ".data", "uploads");

/**
 * Yuklangan rasmni WebP'ga o'giradi (eng ko'pi 1600px) va saqlaydi.
 * Qaytaradi: saytda ishlatiladigan URL (Blob URL yoki /uploads/...).
 */
export async function saveImage(file: File, folder: "products" | "categories", baseName: string) {
  if (!file.type.startsWith("image/")) throw new Error("Faqat rasm fayli yuklash mumkin (JPG, PNG, WebP).");
  if (file.size > MAX_BYTES) throw new Error("Rasm hajmi 8 MB dan oshmasligi kerak.");
  if (!uploadsEnabled) throw new Error("Rasm yuklash uchun Vercel Blob ulanmagan (BLOB_READ_WRITE_TOKEN).");

  const webp = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const name = `${baseName}-${Date.now().toString(36)}.webp`;

  if (blobEnabled) {
    const blob = await put(`${folder}/${name}`, webp, { access: "public", contentType: "image/webp" });
    return blob.url;
  }
  // lokal: .data/uploads (public/ ga emas — production'da build'dan keyin qo'shilgan fayllar berilmaydi)
  const dir = join(uploadsDir, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), webp);
  return `/uploads/${folder}/${name}`;
}
