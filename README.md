# NovaLab — Next.js + Tailwind CSS

Analitik uskunalar, reagentlar va laboratoriya servisi kompaniyasi uchun 3 tilli (UZ / RU / EN) sayt.

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:3000  →  /uz ga yo'naltiradi
npm run build && npm start   # production
```

Node.js 20.9+ kerak.

## Tuzilma

```
app/
  [lang]/layout.tsx              header, footer, mavzu, SEO
  [lang]/page.tsx                bosh sahifa (barcha bo'limlar)
  [lang]/products/page.tsx       katalog
  [lang]/products/[slug]/page.tsx  yo'nalish sahifasi + model qidiruvi + so'rov formasi
  api/lead/route.ts              forma endpointi (Telegram'ga yuborish)
  globals.css                    Tailwind v4 va rang tokenlari (yorug'/tungi)
components/                      Header, Footer, PeriodicGrid, LeadForm, ModelExplorer...
lib/i18n.ts                      barcha matnlar 3 tilda + kontaktlar
lib/catalog.ts                   mahsulot yo'nalishlari, modellar, xizmatlar, sohalar
```

## Nimani o'zgartirish kerak

- **Kontaktlar** (telefon, email, ijtimoiy tarmoqlar): `lib/i18n.ts` oxiridagi `company` obyekti; manzil — `contact.addressV`.
- **Kompaniya nomi**: `NovaLab` — `components/Logo.tsx`, `lib/i18n.ts`, `app/icon.svg`.
- **Mahsulotlar**: `lib/catalog.ts` — model qo'shish uchun tegishli `groups` ro'yxatiga nom qo'shing.
- **Ranglar**: `app/globals.css` dagi `:root` va `.dark` o'zgaruvchilari.

## So'rovlarni Telegram'ga olish

`.env.local` fayl yarating:

```
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=-100xxxxxxxxxx
```

Sozlanmagan bo'lsa, so'rovlar server konsoliga yoziladi.
# proyekt
