/**
 * Admin panel himoyasi: login/parol muhit o'zgaruvchilaridan, sessiya — imzolangan cookie (HMAC-SHA256).
 *   ADMIN_LOGIN     — login (standart: "admin")
 *   ADMIN_PASSWORD  — parol (production'da majburiy; lokalda standart "admin123")
 *   AUTH_SECRET     — imzo kaliti (ixtiyoriy; berilmasa paroldan hosil qilinadi — parol o'zgarsa sessiyalar bekor bo'ladi)
 * Web Crypto ishlatiladi — proxy.ts va server kodida bir xil ishlaydi.
 */
export const SESSION_COOKIE = "sp_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 kun

const isProd = process.env.NODE_ENV === "production";
export const adminLogin = () => process.env.ADMIN_LOGIN || "admin";
export const adminPassword = () => process.env.ADMIN_PASSWORD || (isProd ? "" : "admin123");
/** Production'da parol o'rnatilmagan bo'lsa — kirish o'chiq */
export const loginEnabled = () => adminPassword().length > 0;
export const usingDefaultPassword = () => !process.env.ADMIN_PASSWORD;

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) =>
  Buffer.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf)).toString("base64url");

async function key() {
  const secret = process.env.AUTH_SECRET || `sp:${adminLogin()}:${adminPassword()}`;
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSessionToken() {
  const payload = b64url(enc.encode(JSON.stringify({ u: adminLogin(), exp: Date.now() + MAX_AGE * 1000 })));
  const sig = b64url(await crypto.subtle.sign("HMAC", await key(), enc.encode(payload)));
  return { token: `${payload}.${sig}`, maxAge: MAX_AGE };
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !loginEnabled()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(), Buffer.from(sig, "base64url"), enc.encode(payload));
    if (!ok) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { u: string; exp: number };
    return data.u === adminLogin() && data.exp > Date.now();
  } catch {
    return false;
  }
}

/** Vaqtga bog'liq bo'lmagan taqqoslash (parolni taxmin qilishni qiyinlashtiradi) */
export async function safeEqual(a: string, b: string) {
  const k = await key();
  const [x, y] = await Promise.all([crypto.subtle.sign("HMAC", k, enc.encode(a)), crypto.subtle.sign("HMAC", k, enc.encode(b))]);
  return Buffer.from(x).equals(Buffer.from(y));
}
