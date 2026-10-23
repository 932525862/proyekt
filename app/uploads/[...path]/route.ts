import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";
import { uploadsDir } from "@/lib/upload";

/** Lokal muhitda admin yuklagan rasmlarni beradi (Vercel'da rasmlar Blob'dan keladi) */
export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const rel = normalize((await params).path.join("/"));
  if (rel.startsWith("..") || !/^(products|categories)\/[\w.-]+\.webp$/.test(rel)) return new Response("Not found", { status: 404 });
  try {
    const file = await readFile(join(uploadsDir, rel));
    return new Response(new Uint8Array(file), { headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
