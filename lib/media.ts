import type { Category } from "./catalog";
import placeholders from "./placeholders.json";
import type { T } from "./i18n";

/**
 * Rasmlar xaritasi.
 * Mahsulot rasmlari — ishlab chiqaruvchilarning rasmiy saytlaridan (Bruker, Magritek, KNAUER, KERN & SOHN, Copley Scientific).
 * Fon suratlari — Unsplash (bepul tijoriy litsenziya). Manbalar ro'yxati: IMAGE_SOURCES.md
 */
export type Media = { src: string; alt: string; fit?: "contain" | "cover" };

/** Rasmning xira oldindan ko'rinishi (scripts/placeholders.mjs yaratadi) */
export const blurFor = (src: string): string | undefined => (placeholders as Record<string, string>)[src];

/** next/image uchun: oldindan ko'rinish bo'lsa — blur, bo'lmasa — bo'sh */
export const blurProps = (src: string) => {
  const blurDataURL = blurFor(src);
  return blurDataURL ? ({ placeholder: "blur", blurDataURL } as const) : ({ placeholder: "empty" } as const);
};

const p = (name: string, alt: string, fit: Media["fit"] = "contain"): Media => ({ src: `/images/products/${name}.webp`, alt, fit });
const photo = (name: string, alt: string): Media => ({ src: `/images/photos/${name}.webp`, alt, fit: "cover" });
const cp = (name: string, alt: string): Media => ({ src: `/images/copley/${name}.webp`, alt: `Copley ${alt}`, fit: "contain" });

/** Har bir yo'nalishning asosiy rasmi */
export const categoryMedia: Record<string, Media> = {
  nmr: p("nmr-spinsolve", "Magritek Spinsolve benchtop NMR", "cover"),
  "mass-spectrometry": p("ms-tq", "Bruker mass spectrometer"),
  hplc: p("hplc-azura", "KNAUER AZURA HPLC system"),
  columns: p("hplc-column", "KNAUER HPLC column"),
  reagents: photo("reagents", "HPLC-grade solvent sample preparation"),
  "reference-materials": photo("ampoules", "Certified reference material ampoules"),
  balances: { src: "/images/kern/ABP.webp", alt: "KERN ABP analytical balance", fit: "contain" },
  "moisture-analyzers": { src: "/images/kern/DBS.webp", alt: "KERN DBS moisture analyzer", fit: "contain" },
  dissolution: cp("dis-005", "DIS 800i dissolution tester"),
  "tablet-testing": cp("frv-004", "FRV 210i friability tester"),
  "powder-testing": cp("pta", "PTW with PTA 100i powder testing assistant"),
  "inhaler-testing": cp("ngi", "Next Generation Impactor"),
};

/** Copley Scientific — har bir model uchun alohida rasm */
const copleyModels: Record<string, Media> = {
  "DIS 600i": cp("dis-002", "DIS 600i"),
  "DIS 800i": cp("dis-005", "DIS 800i"),
  "DTG 100i": cp("dtg-001", "DTG 100i"),
  "DTG 200i": cp("dtg-002", "DTG 200i"),
  "DTG 300i": cp("dtg-003", "DTG 300i"),
  "DTG 400i": cp("dtg-004", "DTG 400i"),
  "DTG 200i-IS": cp("dtg-005", "DTG 200i-IS"),
  "SDT 1000": cp("sdt", "SDT 1000"),
  VTT: cp("sup-001", "Vaginal Tablet Tester"),
  "HDT 1000": cp("vdc-008", "HDT 1000 vertical diffusion cells"),
  "FRV 110i": cp("frv-001", "FRV 110i"),
  "FRV 210i": cp("frv-004", "FRV 210i"),
  "Friabimat SA-400": cp("fbm-002", "Friabimat SA-400"),
  "TBF 100i": cp("tbf-001", "TBF 100i"),
  "TH3/200": cp("th3-001", "TH3 hardness tester"),
  "TH3/500": cp("th3-001", "TH3 hardness tester"),
  "Thickness Tester 547": cp("thi-001", "Tablet Thickness Tester 547"),
  "Thickness Tester 700": cp("thi-002", "Tablet Thickness Tester 700"),
  "Digital Caliper 500": cp("cal-500", "Digital Caliper 500"),
  "JV 120i": cp("jv-007", "JV 120i"),
  "JV 220i": cp("jb-004", "JV 220i"),
  "PTW Angle of Repose": cp("ptw-aor", "PTW angle of repose"),
  "PTW Flow via Cylinder": cp("ptw-cyl", "PTW flow via cylinder"),
  "PTW Flow via Funnel": cp("ptw-aor", "PTW flow via funnel"),
  "PTW Scott Volumeter": cp("ptw-bulk", "PTW Scott volumeter"),
  "PTA 100i": cp("pta", "PTA 100i"),
  "Next Generation Impactor (NGI)": cp("ngi", "Next Generation Impactor"),
  "Andersen Cascade Impactor (ACI)": cp("aci", "Andersen Cascade Impactor set-up"),
  "Multi-Stage Liquid Impinger (MSLI)": cp("msli", "MSLI set-up"),
  "DUSA for MDIs": cp("dusa", "DUSA"),
  "DUSA for DPIs": cp("dusa", "DUSA"),
  "BRS 100i Breathing Simulator": cp("brs", "BRS 100i"),
  "Flow Rate Sensor FRS": cp("frs", "Flow Rate Sensor"),
  "Flow Meter DFM 2000": cp("dfm", "DFM 2000"),
  "LCP7 Vacuum Pump": cp("lcp7", "LCP7 vacuum pump"),
  "SRS 100i Sample Recovery System": cp("srs", "SRS 100i"),
  "Inhaled Dissolution Apparatus (IDA)": cp("ida", "Inhaled Dissolution Apparatus"),
  "Inhalytix+": cp("inhalytix", "Inhalytix+ software"),
};

/** Model guruhlari rasmlari (guruh nomi inglizcha kalit bo'yicha) */
const groupMedia: Record<string, Media> = {
  Spinsolve: p("nmr-spinsolve", "Magritek Spinsolve", "cover"),
  "Other NMR systems": p("nmr-lab", "Magritek NMR in the laboratory", "cover"),
  timsTOF: p("ms-timstof", "Bruker timsTOF Pro 2"),
  QTOF: p("ms-qtof", "Bruker compact QTOF"),
  "MALDI-TOF/TOF": p("ms-maldi", "Bruker rapifleX MALDI-TOF/TOF"),
  MRMS: p("ms-mrms", "Bruker solariX MRMS"),
  "Triple Quad": p("ms-tq", "Bruker EVOQ triple quadrupole"),
  "DART-MS": p("ms-dart", "Bruker DART JumpShot"),
  "LC & ion sources": p("ms-elute", "Bruker Elute LC"),
  AZURA: p("hplc-azura", "KNAUER AZURA HPLC"),
  Osmometers: p("hplc-osmometer", "KNAUER K-7400S osmometer"),
  Orbit: p("hplc-column", "KNAUER HPLC column"),
};

export const groupImage = (name: T | string) => groupMedia[typeof name === "string" ? name : name.en];

/** KERN seriyalari — rasm faqat aynan shu seriya uchun mavjud bo'lsa ko'rsatiladi */
const kernSeries = new Set(["440", "572", "ABP", "DAB", "DBS", "DLB", "EG", "EW", "EWJ", "PBS", "PCB", "PCD", "PFB", "PLS", "PNS", "PWS"]);

export function modelImage(category: Category, group: T | string, model: string): Media | undefined {
  if (category.brand === "Copley Scientific") return copleyModels[model];
  if (category.brand.startsWith("KERN")) {
    const series = model.replace(/^IoT-Line /, "").match(/^([A-Z]+|\d{3})/)?.[1];
    return series && kernSeries.has(series) ? { src: `/images/kern/${series}.webp`, alt: `KERN ${model}`, fit: "contain" } : undefined;
  }
  return groupImage(group);
}

/** Tanlangan uskunalar rasmlari */
export const featuredMedia: Record<string, Media> = {
  "Spinsolve 90": groupMedia.Spinsolve,
  "timsTOF Pro 2": groupMedia.timsTOF,
  "AZURA UHPLC": groupMedia.AZURA,
  "DART JumpShot": groupMedia["DART-MS"],
  "KERN ABP 100-5DM": categoryMedia.balances,
  "LGC CRM": categoryMedia["reference-materials"],
  "DIS 800i": copleyModels["DIS 800i"],
  "Next Generation Impactor (NGI)": copleyModels["Next Generation Impactor (NGI)"],
  "TBF 100i": copleyModels["TBF 100i"],
};

/** Farmatsevtik sifat nazorati zanjiri (bosh sahifa) */
export const pharmaFlow = {
  powder: copleyModels["JV 220i"],
  tablet: copleyModels["TBF 100i"],
  disintegration: copleyModels["DTG 200i"],
  dissolution: copleyModels["DIS 600i"],
  inhaler: copleyModels["Next Generation Impactor (NGI)"],
};

/** Sahifa bo'limlari uchun suratlar */
export const photos = {
  hero: photo("lab-corridor", "Modern analytical laboratory"),
  team: photo("lab-team", "Scientists working in a laboratory"),
  pipette: photo("lab-pipette", "Sample preparation with a pipette"),
  beaker: photo("lab-beaker", "Instrument maintenance and validation"),
  goggles: photo("lab-goggles", "Laboratory specialist"),
};

/** Sohalar plitkalari */
export const industries: { title: T; image: Media; icon: string }[] = [
  { title: { uz: "Farmatsevtika", ru: "Фармацевтика", en: "Pharmaceuticals" }, image: photo("ind-pharma", "Pharmaceutical products"), icon: "pill" },
  { title: { uz: "Oziq-ovqat va yem", ru: "Пищевая отрасль и корма", en: "Food & feed" }, image: photo("ind-food", "Fresh food products"), icon: "wheat" },
  { title: { uz: "Qishloq xo'jaligi", ru: "Сельское хозяйство", en: "Agriculture" }, image: photo("ind-agri", "Agricultural field"), icon: "sprout" },
  { title: { uz: "Biotexnologiya", ru: "Биотехнологии", en: "Biotechnology" }, image: photo("ind-biotech", "Cells under fluorescence microscopy"), icon: "dna" },
  { title: { uz: "Kimyo", ru: "Химия", en: "Chemistry" }, image: photo("ind-chem", "Molecular model"), icon: "atom" },
  { title: { uz: "Sog'liqni saqlash", ru: "Здравоохранение", en: "Public health" }, image: photo("ind-health", "Clinical sample tubes"), icon: "heart" },
];
