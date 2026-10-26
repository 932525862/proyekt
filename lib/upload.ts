import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { uploadsDir } from "@/lib/storage-paths";

const spacesBucket = process.env.SPACES_BUCKET;
const spacesRegion = process.env.SPACES_REGION;
const spacesKey = process.env.SPACES_KEY;
const spacesSecret = process.env.SPACES_SECRET;
const spacesEndpoint = process.env.SPACES_ENDPOINT || (spacesRegion ? `https://${spacesRegion}.digitaloceanspaces.com` : undefined);

/** DigitalOcean Spaces is the preferred durable image store on App Platform. */
export const spacesEnabled = Boolean(spacesBucket && spacesRegion && spacesKey && spacesSecret && spacesEndpoint);
/** Vercel and App Platform disks are ephemeral; a Droplet's local disk is persistent. */
const onEphemeralPlatform = Boolean(process.env.VERCEL) || process.env.DO_APP_PLATFORM === "1";
export const uploadsEnabled = spacesEnabled || process.env.NODE_ENV !== "production" || !onEphemeralPlatform;
export const imageStorageProvider = spacesEnabled
  ? "DigitalOcean Spaces"
  : !uploadsEnabled
    ? "Ulanmagan"
    : process.env.NODE_ENV === "production"
      ? "Lokal disk (Droplet)"
      : "Lokal (.data/uploads)";

let spacesClient: S3Client | undefined;
function getSpacesClient() {
  if (!spacesEnabled || !spacesRegion || !spacesEndpoint || !spacesKey || !spacesSecret) {
    throw new Error("DigitalOcean Spaces uchun SPACES_BUCKET, SPACES_REGION, SPACES_KEY va SPACES_SECRET kerak.");
  }
  spacesClient ??= new S3Client({
    region: spacesRegion,
    endpoint: spacesEndpoint,
    credentials: { accessKeyId: spacesKey, secretAccessKey: spacesSecret },
  });
  return spacesClient;
}

const MAX_BYTES = 8 * 1024 * 1024;
/** Lokal yuklangan rasmlar /uploads/[...path] route orqali beriladi. */

/**
 * Yuklangan rasmni WebP'ga o'giradi (eng ko'pi 1600px) va saqlaydi.
 * Qaytaradi: Spaces public URL yoki lokal server URL.
 */
export async function saveImage(file: File, folder: "products" | "categories", baseName: string) {
  if (!file.type.startsWith("image/")) throw new Error("Faqat rasm fayli yuklash mumkin (JPG, PNG, WebP).");
  if (file.size > MAX_BYTES) throw new Error("Rasm hajmi 8 MB dan oshmasligi kerak.");
  if (!uploadsEnabled) throw new Error("Rasm yuklash uchun DigitalOcean Spaces sozlamalari kerak.");

  const webp = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const name = `${baseName}-${Date.now().toString(36)}.webp`;
  const key = `${folder}/${name}`;

  if (spacesEnabled) {
    await getSpacesClient().send(
      new PutObjectCommand({
        Bucket: spacesBucket,
        Key: key,
        Body: webp,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
        ACL: "public-read",
      }),
    );
    const baseUrl = process.env.SPACES_CDN_URL?.replace(/\/+$/, "") ?? `https://${spacesBucket}.${spacesRegion}.digitaloceanspaces.com`;
    return `${baseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  // Local disk works on development machines and persistent Droplets. Ephemeral
  // production platforms are blocked above unless Spaces is configured.
  const dir = join(uploadsDir, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), webp);
  return `/uploads/${folder}/${name}`;
}

/** Delete an app-managed local image after callers confirm it is no longer referenced. */
export async function removeLocalImageFile(imageUrl: string) {
  const match = /^\/uploads\/(products|categories)\/([\w.-]+\.webp)$/.exec(imageUrl);
  if (!match) return;

  const root = resolve(uploadsDir);
  const filePath = resolve(root, match[1], match[2]);
  if (!filePath.startsWith(`${root}${sep}`)) return;

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
