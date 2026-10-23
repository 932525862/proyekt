# Spectrum Peak LLC — sayt va admin panel

Analitik uskunalar, reagentlar va laboratoriya servisi kompaniyasi uchun 3 tilli (UZ / RU / EN) sayt va boshqaruv paneli. Next.js 16, Tailwind CSS v4, Drizzle ORM + libSQL (SQLite / Turso).

## Ishga tushirish (lokal)

```bash
npm install
npm run dev                 # http://localhost:3000  →  /uz
```

- Sayt: http://localhost:3000/uz
- Admin panel: http://localhost:3000/admin — login **admin**, parol **admin123** (faqat lokal; production'da o'zingiz o'rnatasiz)

Lokal ma'lumotlar bazasi `.data/spectrum.db` faylida avtomatik yaratiladi va birinchi ishga tushishda hozirgi katalog (12 yo'nalish, 221 model) bilan to'ldiriladi. Hech narsa o'rnatish shart emas. Node.js 20.9+ kerak.

## Admin panel imkoniyatlari

| Bo'lim | Nima qilish mumkin |
|---|---|
| **Boshqaruv paneli** | Yangi zayavkalar soni, so'nggi zayavkalar, katalog holati |
| **Zayavkalar** | Saytdagi formadan kelgan so'rovlar; holat (Yangi / Jarayonda / Bajarildi / Arxiv), ichki izoh, qidiruv, CSV (Excel) eksport, o'chirish |
| **Mahsulotlar** | Qo'shish, tahrirlash, nusxa olish, saytda yashirish/ko'rsatish, o'chirish; rasm yuklash, texnik xususiyatlar (3 tilda), bosh sahifadagi "tanlangan" mahsulotlar |
| **Yo'nalishlar** | Katalog bo'limlari: nom va tavsif 3 tilda, ishlab chiqaruvchi, standartlar, rasm; model guruhlari; yashirish yoki o'chirish |
| **Xizmatlar** | Bosh sahifadagi xizmat kartochkalari: qo'shish, tahrirlash (3 tilda), ikon tanlash, tartibni surish, yashirish, o'chirish; bo'lim sarlavhasi va kirish matni |
| **Sozlamalar** | Telefon, email, Telegram/Instagram/Facebook havolalari; tizim holati |

Admin paneldagi har bir o'zgarish saytda **darhol** ko'rinadi (qayta deploy kerak emas).

## Vercel'ga joylash

1. **Ma'lumotlar bazasi:** Vercel → loyiha → **Storage** → **Create Database** → **Turso** → loyihaga ulang. `TURSO_DATABASE_URL` va `TURSO_AUTH_TOKEN` avtomatik qo'shiladi. Birinchi deploy'da jadvallar yaratiladi va katalog yoziladi.
2. **Rasmlar:** Storage → **Blob** → loyihaga ulang (`BLOB_READ_WRITE_TOKEN` qo'shiladi).
3. **Muhit o'zgaruvchilari** (Settings → Environment Variables):

| O'zgaruvchi | Majburiy | Izoh |
|---|---|---|
| `ADMIN_PASSWORD` | **ha** | Admin parol. O'rnatilmasa, admin panelga kirish o'chiq bo'ladi |
| `ADMIN_LOGIN` | yo'q | Login (standart: `admin`) |
| `AUTH_SECRET` | tavsiya | Sessiya imzosi uchun uzun tasodifiy satr (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | o'z domeningiz bo'lsa | Masalan `https://spectrumpeak.uz` (canonical, sitemap, OG rasmlar) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | yo'q | Har bir zayavka Telegram guruhingizga ham yuboriladi |
| `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION` | yo'q | Search Console / Yandex.Webmaster tasdiqlash kodlari |

4. O'zgaruvchilarni qo'shgandan keyin **Redeploy** qiling.

> Turso ulanmagan bo'lsa ham sayt ishlaydi (hozirgi katalog bilan), lekin admin paneldagi o'zgarishlar va zayavkalar saqlanib qolmaydi — panelda shu haqda ogohlantirish chiqadi.

## Tuzilma

```
app/
  [lang]/                    sayt (uz / ru / en): bosh sahifa, katalog, yo'nalish sahifalari, OG rasmlar
  admin/                     admin panel (login, zayavkalar, mahsulotlar, yo'nalishlar, sozlamalar)
  admin/actions.ts           admin amallari (saqlash, o'chirish, ...)
  api/lead/route.ts          sayt formasi → bazaga + Telegram
  sitemap.ts, robots.ts, manifest.ts
db/
  schema.ts                  jadvallar: categories, groups, products, services, leads, settings
  index.ts                   ulanish (Turso yoki lokal fayl) + avtomatik jadval yaratish
  seed.ts                    boshlang'ich katalogni bazaga yozish
lib/
  data.ts                    sayt uchun keshlangan o'qish (catalog / settings teglari)
  admin-data.ts              admin uchun keshsiz o'qish
  auth.ts, admin-session.ts  admin kirishi (imzolangan cookie)
  upload.ts                  rasm yuklash (Vercel Blob yoki lokal .data/uploads)
  i18n.ts                    sayt matnlari 3 tilda, kompaniya nomi
  catalog.ts                 boshlang'ich katalog (faqat birinchi to'ldirish uchun), xizmatlar, sohalar
proxy.ts                     til aniqlash va /admin himoyasi
```

## Foydali buyruqlar

```bash
npm run build && npm start   # production rejimini lokal sinash (ADMIN_PASSWORD=... npm start)
npm run placeholders         # public/images ga yangi rasm qo'shilsa — xira oldindan ko'rinishlarni yangilash
```
