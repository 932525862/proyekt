/**
 * Rasm oldindan ko'rinishlari (blur placeholder) — sahifa HTML'i bilan birga darhol ko'rinadi.
 * Yangi rasm qo'shganda qayta ishga tushiring:  npm run placeholders
 */
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = join(process.cwd(), "public");
// mahsulot rasmlari oq "studiya" fonida ko'rsatiladi; fon suratlari esa o'z holicha
const dirs = { "images/products": "#ffffff", "images/copley": "#ffffff", "images/kern": "#ffffff", "images/photos": null };

const out = {};
for (const [dir, bg] of Object.entries(dirs)) {
  for (const file of (await readdir(join(root, dir))).filter((f) => /\.(webp|png|jpe?g)$/.test(f)).sort()) {
    let img = sharp(join(root, dir, file)).resize({ width: 24, height: 24, fit: "inside" });
    if (bg) img = img.flatten({ background: bg });
    const buf = await img.webp({ quality: 40 }).toBuffer();
    out[`/${dir}/${file}`] = `data:image/webp;base64,${buf.toString("base64")}`;
  }
}
await writeFile(join(process.cwd(), "lib/placeholders.json"), JSON.stringify(out, null, 0) + "\n");
console.log(`${Object.keys(out).length} ta placeholder, ${Math.round(JSON.stringify(out).length / 1024)} KB`);
