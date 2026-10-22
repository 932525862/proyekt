import type { Locale, T } from "./i18n";

/**
 * Model spetsifikatsiyalari (ishlab chiqaruvchi ma'lumotlari asosida).
 * cat — ishlab chiqaruvchining katalog raqami, std — farmakopeya / standart muvofiqligi.
 */
type SpecKey = keyof typeof labels;
export type ModelSpec = { cat?: string; std?: string; specs: [SpecKey, string | T][] };

export const labels = {
  vessels: { uz: "Idishlar", ru: "Сосуды", en: "Vessels" },
  stations: { uz: "Stansiyalar", ru: "Станции", en: "Stations" },
  capacity: { uz: "Sig'im", ru: "Загрузка", en: "Capacity" },
  methods: { uz: "Usullar", ru: "Методы", en: "Methods" },
  dims: { uz: "O'lchamlar", ru: "Габариты", en: "Dimensions" },
  drums: { uz: "Barabanlar", ru: "Барабаны", en: "Drums" },
  force: { uz: "Kuch", ru: "Усилие", en: "Force" },
  diameter: { uz: "Maks. diametr", ru: "Макс. диаметр", en: "Max. diameter" },
  size: { uz: "Maks. o'lcham", ru: "Макс. размер", en: "Max. size" },
  accuracy: { uz: "Aniqlik", ru: "Точность", en: "Accuracy" },
  flow: { uz: "Oqim", ru: "Расход", en: "Flow" },
  stages: { uz: "Bosqichlar", ru: "Ступени", en: "Stages" },
  volume: { uz: "Hajm", ru: "Объём", en: "Volume" },
  rate: { uz: "Chastota", ru: "Частота", en: "Frequency" },
  vacuum: { uz: "Vakuum", ru: "Вакуум", en: "Vacuum" },
  cells: { uz: "Yacheykalar", ru: "Ячейки", en: "Cells" },
  timer: { uz: "Taymer", ru: "Таймер", en: "Timer" },
  type: { uz: "Turi", ru: "Тип", en: "Type" },
  modes: { uz: "Rejimlar", ru: "Режимы", en: "Modes" },
  products: { uz: "Mahsulotlar", ru: "Продукты", en: "Products" },
} satisfies Record<string, T>;

const DIS = "Ph. Eur. 2.9.3 · USP <711>";
const DTG = "Ph. Eur. 2.9.1 · USP <701>";
const FRV = "Ph. Eur. 2.9.7 · USP <1216>";
const TBF = "Ph. Eur. 2.9.8 · USP <1217>";
const JV = "Ph. Eur. 2.9.34 · USP <616>";
const PTW = "Ph. Eur. 2.9.36 · USP <1174>";
const APSD = "Ph. Eur. 2.9.18 · USP <601>";

const independent: T = { uz: "2 (mustaqil)", ru: "2 (независимые)", en: "2 (independent)" };
const coated: T = { uz: "Qobiqli tabletkalar", ru: "Таблетки в оболочке", en: "Coated tablets" };
const direct: T = { uz: "To'g'ridan-to'g'ri / komparator", ru: "Прямой / компаратор", en: "Direct / comparator" };
const plusFilter = (n: number): T => ({ uz: `${n} + filtr`, ru: `${n} + фильтр`, en: `${n} + filter` });
const inhalers: T = { uz: "MDI, DPI, nebulayzer, burun", ru: "MDI, DPI, небулайзеры, назальные", en: "MDI, DPI, nebuliser, nasal" };

export const modelSpecs: Record<string, ModelSpec> = {
  // Dissolyutsiya va parchalanish
  "DIS 600i": { cat: "1336", std: DIS, specs: [["vessels", "6"], ["methods", "1, 2, 5, 6"], ["dims", "728 × 495 × 689 mm"]] },
  "DIS 800i": { cat: "1338", std: DIS, specs: [["vessels", "8"], ["methods", "1, 2, 5, 6"], ["dims", "728 × 495 × 689 mm"]] },
  "DTG 100i": { cat: "1231", std: DTG, specs: [["stations", "1"], ["capacity", "≤ 6"], ["dims", "450 × 473 × 657 mm"]] },
  "DTG 200i": { cat: "1232", std: DTG, specs: [["stations", "2"], ["capacity", "≤ 12"], ["dims", "450 × 473 × 657 mm"]] },
  "DTG 300i": { cat: "1233", std: DTG, specs: [["stations", "3"], ["capacity", "18"], ["dims", "700 × 473 × 657 mm"]] },
  "DTG 400i": { cat: "1234", std: DTG, specs: [["stations", "4"], ["capacity", "24"], ["dims", "700 × 473 × 657 mm"]] },
  "DTG 200i-IS": { std: DTG, specs: [["stations", independent], ["capacity", "≤ 12"]] },
  "SDT 1000": { cat: "1704", std: "Ph. Eur. 2.9.2 · 2.9.22", specs: [["stations", "1 + 3"], ["dims", "510 × 280 × 500 mm"]] },
  VTT: { cat: "1800", std: "Ph. Eur. 2.9.2", specs: [["stations", "1"]] },
  "HDT 1000": { cat: "7290", std: "USP <1724>", specs: [["cells", "≤ 10 · B, C, Skin"]] },
  // Tabletkalar
  "FRV 110i": { cat: "1441", std: FRV, specs: [["drums", "1"], ["dims", "316 × 343 × 325 mm"]] },
  "FRV 210i": { cat: "1442", std: FRV, specs: [["drums", "2"], ["dims", "407 × 343 × 325 mm"]] },
  "Friabimat SA-400": { cat: "1460", std: "Ph. Eur. 2.9.41 (B)", specs: [["type", coated], ["dims", "440 × 300 × 220 mm"]] },
  "TBF 100i": { cat: "2532", std: TBF, specs: [["force", "0–490 N"], ["diameter", "36 mm"], ["dims", "283 × 237 × 208 mm"]] },
  "TH3/200": { cat: "7801", std: TBF, specs: [["force", "0–200 N ± 0.04"], ["diameter", "30 mm"]] },
  "TH3/500": { cat: "7802", std: TBF, specs: [["force", "0–500 N ± 0.1"], ["diameter", "30 mm"]] },
  "Thickness Tester 547": { specs: [["modes", direct], ["accuracy", "0.01 mm"]] },
  "Thickness Tester 700": { cat: "4903", specs: [["size", "12 mm"], ["accuracy", "0.01 mm"]] },
  "Digital Caliper 500": { cat: "4901", specs: [["size", "150 mm"], ["accuracy", "0.01 mm"]] },
  // Kukunlar
  "JV 120i": { cat: "1691", std: JV, specs: [["stations", "1"], ["methods", "1, 2, 3"]] },
  "JV 220i": { cat: "1692", std: JV, specs: [["stations", "2"], ["methods", "1, 2, 3"]] },
  "PTW Angle of Repose": { cat: "1670", std: PTW, specs: [] },
  "PTW Flow via Cylinder": { std: "Ph. Eur. 2.9.16 · 2.9.36", specs: [] },
  "PTW Flow via Funnel": { std: "Ph. Eur. 2.9.16 · 2.9.36", specs: [] },
  "PTW Scott Volumeter": { cat: "6310", std: "Ph. Eur. 2.9.34 · ISO 3923-2", specs: [] },
  "PTA 100i": { cat: "1680", std: "USP · Ph. Eur. · ASTM · ISO", specs: [] },
  // Ingalyatsion testlar
  "Next Generation Impactor (NGI)": { std: APSD, specs: [["stages", "7 + MOC"], ["flow", "30–100 L/min"]] },
  "Andersen Cascade Impactor (ACI)": { std: APSD, specs: [["stages", plusFilter(8)], ["flow", "28.3 L/min"]] },
  "Multi-Stage Liquid Impinger (MSLI)": { std: APSD, specs: [["stages", plusFilter(4)]] },
  "Glass Twin Impinger (GTI)": { std: "Ph. Eur. 2.9.18", specs: [["stages", "2"]] },
  "DUSA for MDIs": { std: "USP <601>", specs: [["products", "MDI"]] },
  "DUSA for DPIs": { std: "USP <601>", specs: [["products", "DPI"]] },
  "BAC 100i Breath Actuation Controller": { specs: [["timer", "0–600 s"]] },
  "BRS 100i Breathing Simulator": { std: "Ph. Eur. 2.9.44 · USP <1601>", specs: [["volume", "0–800 mL"], ["rate", "12–40 bpm"]] },
  "Flow Rate Sensor FRS": { specs: [["flow", "±200 L/min"], ["type", "MEMS"]] },
  "LCP7 Vacuum Pump": { specs: [["flow", "133 L/min"], ["vacuum", "< 15 kPa"], ["products", inhalers]] },
  "Inhaled Dissolution Apparatus (IDA)": { specs: [["flow", "5–100 L/min"], ["stations", "6 / 8"]] },
};

export const specText = (v: string | T, lang: Locale) => (typeof v === "string" ? v : v[lang]);
