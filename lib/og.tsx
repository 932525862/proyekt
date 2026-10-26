/* eslint-disable @next/next/no-img-element -- ImageResponse (Satori) faqat oddiy <img> tegini qabul qiladi */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { markSvg } from "./brand";
import { company, siteUrl } from "./i18n";

/** Ijtimoiy tarmoqlar uchun 1200×630 rasm (Telegram, Facebook, WhatsApp, LinkedIn, X) */
export const ogSize = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "node_modules/@fontsource/inter/files", file));
// Lotin va kirill — alohida nomlar bilan: Satori har bir qalinlik uchun to'g'ri zaxira shriftni tanlashi uchun
const fontsP = Promise.all(
  ([["latin", "Inter"], ["cyrillic", "InterCyr"]] as const).flatMap(([subset, name]) =>
    ([400, 600, 700] as const).map(async (weight) => ({ name, weight, style: "normal" as const, data: await font(`inter-${subset}-${weight}-normal.woff`) })),
  ),
);
/** Brend nomlari qatorda bo'linmasligi uchun */
export const nbsp = (s: string) => s.replace(/ /g, "\u00a0");

const toDataUrl = (buf: Buffer) => `data:image/png;base64,${buf.toString("base64")}`;
const markP = sharp(Buffer.from(markSvg({ dark: true }))).resize({ width: 220 }).png().toBuffer().then(toDataUrl);

/** Rasmni (public/ yoki tashqi URL — masalan DigitalOcean Spaces) Satori qabul qiladigan PNG'ga o'giradi */
export async function publicImage(src: string, width = 520) {
  const input = /^https?:/.test(src) ? Buffer.from(await (await fetch(src)).arrayBuffer()) : join(process.cwd(), "public", src);
  const buf = await sharp(input).resize({ width, height: width, fit: "inside", withoutEnlargement: true }).png().toBuffer();
  return toDataUrl(buf);
}

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  chips?: string[];
  images: { src: string; cover?: boolean }[];
  footer: string;
};

export async function renderOg({ eyebrow, title, subtitle, chips = [], images, footer }: Props) {
  const [fonts, mark] = await Promise.all([fontsP, markP]);
  const pics = await Promise.all(images.map(async (im) => ({ ...im, data: await publicImage(im.src, images.length > 1 ? 360 : 640) })));
  const domain = new URL(siteUrl).host;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", fontFamily: "Inter, InterCyr", background: "linear-gradient(135deg, #071629 0%, #0c2240 60%, #0b2a52 100%)", color: "#e6edf6", position: "relative" }}>
        {/* spektr chizig'i — fon detali */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M0 606 L640 606 L700 605 L716 586 L730 605 L800 606 L840 604 L856 560 L872 605 L960 606 L1000 604 L1014 578 L1028 605 L1200 606" fill="none" stroke="#14b8c4" strokeOpacity="0.4" strokeWidth="2" />
          <path d="M0 607 L1200 607" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: images.length ? 640 : 1072, padding: "56px 0 56px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={mark} width={98} height={60} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, fontSize: 34, fontWeight: 700, color: "#ffffff", letterSpacing: -0.5 }}>
                {company.brand}
                <span style={{ fontSize: 22, fontWeight: 600, color: "#8fa8c4" }}>LLC</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: 2.5, color: "#7fa3c9", textTransform: "uppercase", marginTop: 4 }}>Analytical Solutions</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase", color: "#2dd4dc" }}>{eyebrow}</div>
            <div style={{ fontSize: title.length > 60 ? 46 : 54, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.2, color: "#ffffff", marginTop: 14 }}>{title}</div>
            <div style={{ fontSize: 23, lineHeight: 1.4, color: "#a9bdd4", marginTop: 18 }}>{subtitle}</div>
            {chips.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                {chips.map((c) => (
                  <div key={c} style={{ fontSize: 17, fontWeight: 600, color: "#2dd4dc", border: "1px solid rgba(45,212,220,0.4)", background: "rgba(45,212,220,0.1)", padding: "5px 10px", borderRadius: 4 }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 22, fontSize: 20, fontWeight: 600, color: "#cfdbe8", whiteSpace: "nowrap" }}>
            <span>{company.phone}</span>
            <span style={{ color: "#5f7a99" }}>·</span>
            <span>{domain}</span>
            <span style={{ color: "#5f7a99" }}>·</span>
            <span style={{ color: "#8fa8c4", fontWeight: 400 }}>{footer}</span>
          </div>
        </div>

        {pics.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: 14, width: 560, padding: "48px 56px 64px 24px" }}>
            {pics.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: pics.length > 1 ? 225 : 470,
                  height: pics.length > 1 ? 225 : 470,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: p.cover ? "#0c2240" : "#ffffff",
                  boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src={p.data}
                  alt=""
                  style={p.cover ? { width: "100%", height: "100%", objectFit: "cover" } : { width: "82%", height: "82%", objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts },
  );
}
