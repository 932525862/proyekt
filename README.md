# Spectrum Peak LLC — sayt va admin panel

Analitik uskunalar, reagentlar va laboratoriya servisi kompaniyasi uchun 3 tilli (UZ / RU / EN) sayt va boshqaruv paneli. Next.js 16, Tailwind CSS v4, Drizzle ORM + libSQL (SQLite / Turso).

## Ishga tushirish (lokal)

```bash
npm install
npm run dev                 # http://localhost:3000  →  /uz
```

- Sayt: http://localhost:3000/uz
- Admin panel: http://localhost:3000/admin — login **admin**, parol **admin123** (faqat lokal; production'da o'zingiz o'rnatasiz)

Lokal ma'lumotlar bazasi `.data/spectrum.db` faylida avtomatik yaratiladi va birinchi ishga tushishda boshlang'ich katalog bilan to'ldiriladi. Hech narsa o'rnatish shart emas. Node.js 22.x kerak.

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

## DigitalOcean Droplet'ga deploy (tejamkor variant)

Mahsulotlar katalogi kichik va serverda bitta nusxa ishlaydigan holatda ilova SQLite bazasi va yuklangan rasmlarni Droplet diskida saqlay oladi. Bu usulda Turso va Spaces kerak bo'lmaydi. 1 vCPU / 1 GiB RAM Droplet va haftalik backup tanlansa, ma'lumotlar ham shu Droplet backup'iga kiradi.

Yangi Ubuntu 24.04 Droplet uchun dastlabki server sozlamalari `.do/deploy-droplet.sh` skriptida. Skript Node.js 22, 2 GiB swap, `novalab` xizmat foydalanuvchisi, `/var/lib/novalab` ma'lumotlar papkasi, systemd, Nginx va UFW'ni sozlaydi; admin parolini server terminalida yashirin kiritadi. Skriptni faqat birinchi o'rnatishda ishlating; mavjud `/etc/novalab.env` va production bazasini qayta yozmaydi.

Lokal bazani saqlab ko'chirish uchun loyiha katalogida quyidagilarni bajaring. `spectrum.db` nusxasi `.data/` ichidagi bazani, shu jumladan mavjud zayavkalarni ham oladi:

```bash
tar -czf /tmp/novalab-deploy.tar.gz --exclude=.git --exclude=node_modules --exclude=.next --exclude=.data --exclude='.env*' --exclude='*.tsbuildinfo' --exclude=.DS_Store .
sqlite3 .data/spectrum.db '.backup /tmp/spectrum.db'
scp -i ~/.ssh/novalab_do_ed25519 /tmp/novalab-deploy.tar.gz /tmp/spectrum.db .do/deploy-droplet.sh root@DROPLET_IP:/tmp/
ssh -i ~/.ssh/novalab_do_ed25519 root@DROPLET_IP
bash /tmp/deploy-droplet.sh
```

`DROPLET_IP` ni server IP manziliga almashtiring. Skript admin login va kamida 16 belgili parolni server terminalida so'raydi. Dastlab sayt HTTP orqali IP manzilda ochiladi; domen va HTTPS sertifikatini domen ulangandan keyin sozlang.

1. Ubuntu 24.04 bilan Droplet yarating; ilova foydalanuvchisi uchun `/var/lib/novalab` papkasini yarating va unga yozish huquqini bering.
2. Build hamda ishga tushirish muhitida `NOVALAB_DATA_DIR=/var/lib/novalab` ni belgilang. Ilova `spectrum.db` bazasini `/var/lib/novalab/spectrum.db` da, yuklangan WebP rasmlarni `/var/lib/novalab/uploads/` da saqlaydi.
3. Droplet'da `DO_APP_PLATFORM=1` yoki `VERCEL` ni belgilamang — bu qiymatlar App Platform/Vercel kabi vaqtinchalik diskli muhitni bildiradi. Spaces sozlanmagan bo'lsa ham, doimiy Droplet diskida production rasm yuklash va lokal SQLite ishlaydi.
4. `NODE_ENV=production`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET` va kerakli ixtiyoriy integratsiya kalitlarini server muhitiga sozlang. `ADMIN_PASSWORD` va `AUTH_SECRET` ni kuchli, alohida qiymatlar qilib, kod repozitoriyasiga qo'shmang. `TURSO_DATABASE_URL`, `DATABASE_URL` va Spaces qiymatlarini kiritmang — Droplet lokal SQLite va diskdagi rasmlardan foydalanadi.
5. Kodni yangilaydigan deploy jarayoni `/var/lib/novalab/` papkasini o'chirmasligi kerak. Backup sozlanganini tekshiring. Haftalik backup oxirgi backup'dan keyingi o'zgarishlarni tiklamaydi; ma'lumotlar har kuni o'zgarsa, kunlik backup tanlang.

`NOVALAB_DATA_DIR` berilmasa, doimiy muhitda baza va rasmlar loyiha papkasi ichidagi `.data/` da saqlanadi. Serverda kod papkasini almashtirib deploy qilsangiz, shu lokal default yo'lni emas, alohida `/var/lib/novalab` yo'lini ishlating.

`.data/spectrum.db` faylida saqlash kerak bo'lgan lokal admin o'zgarishlari yoki `.data/uploads/` ichida rasmlar bo'lsa, birinchi server ishga tushishidan oldin bazani `/var/lib/novalab/spectrum.db` ga, rasmlarni esa `/var/lib/novalab/uploads/` ga ko'chiring. Yangi bo'sh baza birinchi ishga tushishda boshlang'ich katalog bilan to'ldiriladi.

## DigitalOcean App Platform'ga deploy (Turso/Spaces bilan)

Deploy sozlamasi [.do/app.yaml](.do/app.yaml) da. U `main` branch'dan Node.js servisini build/run qiladi, 8080-portni ochadi va `/api/health` orqali tayyorligini tekshiradi. App Platform Node.js buildpack'i `package.json` dagi Node 22 talabidan foydalanadi.

1. DigitalOcean App Platform'da GitHub orqali `932525862/proyekt` reposining `main` branch'idan app yarating. App yaratilgach, **Settings → App Spec → Edit** bo'limida `.do/app.yaml` mazmunini joylang va saqlang.
2. **Turso/libSQL** bazasini yarating. Build vaqtida sahifa katalogi, sitemap va canonical URL hosil bo'lgani uchun `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` hamda `NEXT_PUBLIC_SITE_URL` ni `RUN_AND_BUILD_TIME` scope'da kiriting. `TURSO_AUTH_TOKEN` ni Secret sifatida saqlang. Build birinchi marta bo'sh bazani schema va katalog bilan to'ldiradi.
3. DigitalOcean **Spaces** bucket yarating va unga chegaralangan access key oling. Rasm fayllari ommaviy ko'rinishi uchun bucket/CDN sozlamalarini tekshiring. Quyidagi sozlamalarni App Platform'da **Run Time** doirasida kiriting: `SPACES_BUCKET`, `SPACES_REGION`, `SPACES_KEY`, `SPACES_SECRET`. `SPACES_KEY` va `SPACES_SECRET` — Secret. CDN yoqilgan bo'lsa `SPACES_CDN_URL` ni ham kiriting.
4. **Run Time**'da quyidagilarni belgilang:

| O'zgaruvchi | Talab | Izoh |
|---|---|---|
| `ADMIN_PASSWORD` | **Majburiy** | Production admin paroli; Secret qilib saqlang. Belgilanmasa admin kirishi yopiq bo'ladi. |
| `AUTH_SECRET` | **Majburiy** | Cookie imzosi uchun mustaqil tasodifiy kalit; Secret qilib saqlang. `openssl rand -base64 32` bilan yarating. |
| `ADMIN_LOGIN` | Tavsiya | Admin login nomi; standart qiymat `admin`. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Ixtiyoriy | Har bir lead'ni Telegram'ga xabarlaydi; Secret qilib saqlang. |
| `GEMINI_API_KEY` | Ixtiyoriy | Admin panelidagi AI tarjima uchun; Secret qilib saqlang. |
| `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION` | Ixtiyoriy | Qidiruv tizimlari tasdiqlash kodlari. |

5. App Platform'da app'ni yaratib deploy qiling, health check **Healthy** bo'lishini va `/api/health` `200` qaytarishini tekshiring. Domen ulangandan keyin `NEXT_PUBLIC_SITE_URL` ni haqiqiy `https://...` origin'ga almashtirib redeploy qiling.

`DO_APP_PLATFORM=1` spec'da qo'yilgan: doimiy DB sozlanmagan bo'lsa ilova `/tmp` dagi vaqtinchalik bazadan foydalanib uni doimiy deb ko'rsatmaydi. Production'da Spaces sozlanmagan bo'lsa lokal diskka rasm yozish o'chiriladi. Next.js keshini bir nechta nusxada muvofiqlashtirish sozlanmagani uchun App Platform spec hozir bitta instance bilan cheklangan. Loyiha DB qatlami libSQL/Turso'ga mo'ljallangan; DigitalOcean Managed PostgreSQL ulab qo'yishning o'zi yetarli. Bu App Platform talablari; Droplet'da yuqoridagi persistent local SQLite va disk upload usulidan foydalanish mumkin.

### Deploydan oldin

- `TURSO_DATABASE_URL` va `TURSO_AUTH_TOKEN` ni build+runtime uchun kiriting — statik katalog, mahsulot sahifalari va sitemap build vaqtida DB'dan o'qiladi.
- `NEXT_PUBLIC_SITE_URL` ni `RUN_AND_BUILD_TIME` scope'da, `https://` bilan to'liq domen qilib kiriting.
- Admin parol va `AUTH_SECRET` ni turlicha, kuchli qiymatlarda o'rnating.
- App Platform build sozlamalari `.do/app.yaml` dagi repo va branch'ga mosligini tekshiring; o'zgarishlarni GitHub'ga yuborgandan keyin deploy qiling.
- Bir nechta instance'ga o'tishdan avval Next.js uchun shared cache va tag invalidation backendini sozlash kerak; aks holda admin o'zgarishlari barcha instance'larda darhol ko'rinmasligi mumkin.

## Tuzilma

```
app/
  [lang]/                    sayt (uz / ru / en): bosh sahifa, katalog, yo'nalish sahifalari, OG rasmlar
  admin/                     admin panel (login, zayavkalar, mahsulotlar, yo'nalishlar, sozlamalar)
  admin/actions.ts           admin amallari (saqlash, o'chirish, ...)
  api/lead/route.ts          sayt formasi → bazaga + Telegram
  api/health/route.ts        DigitalOcean readiness: libSQL ulanishi va boshlang'ich schema
  sitemap.ts, robots.ts, manifest.ts
db/
  schema.ts                  jadvallar: categories, groups, products, services, leads, settings
  index.ts                   ulanish (Turso yoki lokal SQLite) + avtomatik jadval yaratish
  seed.ts                    boshlang'ich katalogni bazaga yozish
lib/storage-paths.ts         baza va yuklangan rasmlar uchun umumiy doimiy papka
lib/
  data.ts                    sayt uchun keshlangan o'qish (catalog / settings teglari)
  admin-data.ts              admin uchun keshsiz o'qish
  auth.ts, admin-session.ts  admin kirishi (imzolangan cookie)
  upload.ts                  rasm yuklash (Spaces yoki doimiy Droplet diski)
  i18n.ts                    sayt matnlari 3 tilda, kompaniya nomi
  catalog.ts                 boshlang'ich katalog (faqat birinchi to'ldirish uchun), xizmatlar, sohalar
proxy.ts                     til aniqlash va /admin himoyasi
.do/app.yaml                 DigitalOcean App Platform build/run/health-check sozlamasi
```

## Foydali buyruqlar

```bash
npm run build && npm start   # production rejimini lokal sinash (ADMIN_PASSWORD=... npm start)
npm run placeholders         # public/images ga yangi rasm qo'shilsa — xira oldindan ko'rinishlarni yangilash
```
