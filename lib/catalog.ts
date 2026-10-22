import type { T } from "./i18n";

export type ModelGroup = { name: T | string; models: string[] };

export type Category = {
  slug: string;
  symbol: string;
  number: number;
  brand: string;
  name: T;
  short: T;
  description: T;
  groups: ModelGroup[];
  /** Farmakopeya va standartlar (yo'nalish sahifasida ko'rsatiladi) */
  standards?: string[];
};

const g = (name: ModelGroup["name"], models: string[]): ModelGroup => ({ name, models });

export const categories: Category[] = [
  {
    slug: "nmr",
    symbol: "Nm",
    number: 1,
    brand: "Magritek",
    name: { uz: "YaMR spektroskopiya", ru: "ЯМР-спектроскопия", en: "NMR spectroscopy" },
    short: { uz: "Stol ustidagi YaMR", ru: "Настольный ЯМР", en: "Benchtop NMR" },
    description: {
      uz: "Spinsolve oilasidagi stol ustidagi YaMR spektrometrlari: kriogen suyuqliklarsiz, oddiy laboratoriya stolida 60–90 MGs. Sintez nazorati, reaksiya monitoringi va o'quv laboratoriyalari uchun.",
      ru: "Настольные ЯМР-спектрометры семейства Spinsolve: 60–90 МГц без криогенных жидкостей, прямо на лабораторном столе. Для контроля синтеза, мониторинга реакций и учебных лабораторий.",
      en: "Spinsolve benchtop NMR spectrometers: 60–90 MHz with no cryogens, right on a lab bench. For synthesis control, reaction monitoring and teaching labs.",
    },
    groups: [
      g("Spinsolve", ["Spinsolve 90", "Spinsolve 90 Benchtop", "Spinsolve 80", "Spinsolve 80 ULTRA", "Spinsolve 60 MHz", "Spinsolve 60 ULTRA", "Autosampler"]),
      g({ uz: "Boshqa YaMR tizimlari", ru: "Другие ЯМР-системы", en: "Other NMR systems" }, ["Kea 2", "NMR-MOUSE"]),
    ],
  },
  {
    slug: "mass-spectrometry",
    symbol: "Ms",
    number: 2,
    brand: "Bruker",
    name: { uz: "Mass-spektrometriya", ru: "Масс-спектрометрия", en: "Mass spectrometry" },
    short: { uz: "QTOF, timsTOF, MALDI", ru: "QTOF, timsTOF, MALDI", en: "QTOF, timsTOF, MALDI" },
    description: {
      uz: "Proteomika, metabolomika, toksikologiya va oziq-ovqat xavfsizligi uchun mass-spektrometrlar: DART-MS'dan tortib timsTOF va MRMS'gacha, dasturiy ta'minot va tayyor yechimlar bilan.",
      ru: "Масс-спектрометры для протеомики, метаболомики, токсикологии и пищевой безопасности: от DART-MS до timsTOF и MRMS, с ПО и готовыми решениями.",
      en: "Mass spectrometers for proteomics, metabolomics, toxicology and food safety: from DART-MS to timsTOF and MRMS, with software and turnkey solutions.",
    },
    groups: [
      g("timsTOF", ["timsTOF Ultra", "timsTOF HT", "timsTOF Pro 2", "timsTOF SCP", "timsTOF fleX", "timsTOF MALDI PharmaPulse"]),
      g("QTOF", ["impact II", "maXis II", "compact", "QTOF-TargetScreener HR"]),
      g("MALDI-TOF/TOF", ["rapifleX", "ultrafleXtreme", "autoflex maX", "microflex"]),
      g("MRMS", ["solariX", "scimaX"]),
      g("Triple Quad", ["EVOQ LC-TQ", "EVOQ GC-TQ"]),
      g("ESI Ion Trap", ["amaZon speed", "amaZon speed ETD", "amaZon SL"]),
      g("DART-MS", ["DART-OS", "DART JumpShot", "DART JumpShot HTS", "DART-MS Consumables"]),
      g({ uz: "LC va ion manbalari", ru: "ЖХ и источники ионов", en: "LC & ion sources" }, ["nanoElute 2", "Elute LC Series", "Compass HyStar", "CaptiveSpray 2", "CaptiveSpray Ultra"]),
      g({ uz: "Yechimlar", ru: "Решения", en: "Solutions" }, ["TwinScape", "Toxtyper"]),
    ],
  },
  {
    slug: "hplc",
    symbol: "Lc",
    number: 3,
    brand: "KNAUER",
    name: { uz: "HHX tizimlari", ru: "Системы ВЭЖХ", en: "HPLC systems" },
    short: { uz: "AZURA tizimlari", ru: "Системы AZURA", en: "AZURA systems" },
    description: {
      uz: "AZURA modulli HHX va UHHX tizimlari: DAD detektorli analitik konfiguratsiyalar, aflatoksinlarni aniqlash uchun tayyor tizim va osmometrlar.",
      ru: "Модульные системы ВЭЖХ и УВЭЖХ AZURA: аналитические конфигурации с ДМД, готовая система для определения афлатоксинов и осмометры.",
      en: "Modular AZURA HPLC and UHPLC systems: analytical DAD configurations, a ready-made aflatoxin system and osmometers.",
    },
    groups: [
      g("AZURA", ["AZURA 862 LPG DAD 2.1 L", "AZURA UHPLC LPG DAD 6.1 L", "AZURA 862 HPG System", "AZURA Aflatoxin System"]),
      g({ uz: "Osmometrlar", ru: "Осмометры", en: "Osmometers" }, ["Osmometer K-7400S"]),
    ],
  },
  {
    slug: "columns",
    symbol: "Cl",
    number: 4,
    brand: "KNAUER",
    name: { uz: "HHX kolonkalari", ru: "Колонки для ВЭЖХ", en: "HPLC columns" },
    short: { uz: "C18 va maxsus fazalar", ru: "C18 и спецфазы", en: "C18 & specialty phases" },
    description: {
      uz: "Teskari fazali va maxsus HHX kolonkalari. Usulingizga mos o'lcham va fazani tanlashda yordam beramiz.",
      ru: "Обращённо-фазовые и специальные колонки для ВЭЖХ. Поможем подобрать размер и фазу под вашу методику.",
      en: "Reversed-phase and specialty HPLC columns. We help you match dimensions and phase to your method.",
    },
    groups: [g("Orbit", ["Orbit 100 C18 5 µm 250 × 4.6 mm"])],
  },
  {
    slug: "reagents",
    symbol: "Rg",
    number: 5,
    brand: "VWR · Merck",
    name: { uz: "Laboratoriya reagentlari", ru: "Лабораторные реактивы", en: "Laboratory reagents" },
    short: { uz: "HHX erituvchilari, KF", ru: "Растворители ВЭЖХ, КФ", en: "HPLC solvents, KF" },
    description: {
      uz: "HHX darajasidagi erituvchilar va Karl Fisher titrlash reagentlari — partiya sertifikatlari bilan, ombordan tez yetkazib berish.",
      ru: "Растворители класса ВЭЖХ и реактивы для титрования по Карлу Фишеру — с сертификатами на партию, быстрая поставка со склада.",
      en: "HPLC-grade solvents and Karl Fischer titration reagents — with batch certificates and fast delivery from stock.",
    },
    groups: [
      g({ uz: "Erituvchilar", ru: "Растворители", en: "Solvents" }, ["Acetonitrile HPLC 99.95% · 2.5 L", "Isopropanol HPLC · 4 L"]),
      g({ uz: "Titrlash", ru: "Титрование", en: "Titration" }, ["CombiNORM 5 TITRINORM Karl Fischer"]),
    ],
  },
  {
    slug: "reference-materials",
    symbol: "Cr",
    number: 6,
    brand: "LGC Standards",
    name: { uz: "Standart namunalar (ISO 17034)", ru: "Стандартные образцы (ISO 17034)", en: "Reference materials (ISO 17034)" },
    short: { uz: "Sertifikatlangan CRM", ru: "Сертифицированные СО", en: "Certified CRMs" },
    description: {
      uz: "LGC Standards bilan hamkorlikda ISO 17034 bo'yicha akkreditatsiyalangan sertifikatlangan standart namunalar — farmatsevtika, oziq-ovqat va atrof-muhit tahlili uchun.",
      ru: "Сертифицированные стандартные образцы по ISO 17034 в партнёрстве с LGC Standards — для фармацевтики, пищевой и экологической аналитики.",
      en: "ISO 17034-accredited certified reference materials in partnership with LGC Standards — for pharma, food and environmental analysis.",
    },
    groups: [g("LGC Standards", ["LGC CRM catalog (on request)", "Ethanol CRM"])],
  },
  {
    slug: "balances",
    symbol: "Bl",
    number: 7,
    brand: "KERN & SOHN",
    name: { uz: "Laboratoriya tarozilari", ru: "Лабораторные весы", en: "Laboratory balances" },
    short: { uz: "Analitik va pretsizion", ru: "Аналитические и прецизионные", en: "Analytical & precision" },
    description: {
      uz: "0.01 mg dan 20 kg gacha: analitik, pretsizion, kompakt va IoT-Line tarozilari. Kalibrlash sertifikati va tekshiruvdan o'tkazish bilan.",
      ru: "От 0,01 мг до 20 кг: аналитические, прецизионные, компактные весы и серия IoT-Line. С сертификатом калибровки и поверкой.",
      en: "From 0.01 mg to 20 kg: analytical, precision, compact and IoT-Line balances. Supplied with calibration certificate and verification.",
    },
    groups: [
      g({ uz: "Analitik", ru: "Аналитические", en: "Analytical" }, ["ABJ 80-4NM", "ABJ 120-4NM", "ABJ 220-4NM", "ABJ 320-4NM", "ABS 120-4N", "ABP 100-4NM", "ABP 100-5M", "ABP 100-5AM", "ABP 100-5DM", "ABP 100-5DAM", "ABP 300-4AM"]),
      g({ uz: "Pretsizion", ru: "Прецизионные", en: "Precision" }, ["EG 220-3NM", "EG 420-3NM", "EG 620-3NM", "EG 2200-2NM", "EG 4200-2NM", "EW 220-3NM", "EW 420-3NM", "EW 620-3NM", "EW 820-2NM", "EW 2200-2NM", "EW 4200-2NM", "EW 6200-2NM", "EW 12000-1NM", "EWJ 300-3", "EWJ 300-3H", "EWJ 600-2M", "EWJ 600-2SM", "EWJ 3000-2", "EWJ 6000-1M", "EWJ 6000-1SM", "PBJ 620-3M", "PBJ 4200-2M", "PBJ 6200-2M", "PBJ 8200-1M", "PBS 620-3M", "PBS 4200-2M", "PBS 6200-2M", "PEJ 2200-2M", "PEJ 4200-2M", "PES 15000-1M", "PLJ 420-3F", "PLJ 720-3A", "PLJ 720-3AM", "PLJ 1200-3A", "PLJ 2000-3A", "PLJ 4200-2F", "PLJ 6200-2A", "PLJ 6200-2AM", "PLS 420-3F", "PLS 1200-3A", "PLS 4200-2F", "PLS 6200-2A", "PLS 8000-2A", "PLS 20000-1F", "PNJ 600-3M", "PNJ 3000-2M", "PNJ 12000-1M", "PNS 600-3", "PNS 12000-1"]),
      g({ uz: "Kompakt", ru: "Компактные", en: "Compact" }, ["PCB 1000-1", "PCB 6000-0", "PCB 10000-1", "PFB 120-3", "PFB 200-3", "PFB 300-3", "PFB 600-2", "PFB 1200-2", "PFB 2000-2", "PFB 3000-2", "PFB 6000-1", "PFB 6000-2", "PWS 800-2", "PWS 3000-1", "PWS 8000-1", "440-21A", "440-33N", "440-35A", "440-35N", "440-43N", "440-45N", "440-47N", "440-49A", "440-49N", "440-51N", "440-53N"]),
      g("IoT-Line", ["572-30", "572-31", "572-32", "572-33", "572-35", "572-37", "572-39", "572-43", "572-45", "572-451", "572-49", "572-55", "572-57", "PCB 200-3-2023e", "PCB 300-2-2023e", "PCB 300-3-2023e", "PCB 1000-2-2023e", "PCB 2000-1-2023e", "PCB 3000-2-2023e", "PCB 6000-0-2023e", "PCB 6000-1-2023e", "PCB 10000-1-2023e"].map((m) => `IoT-Line ${m}`)),
      g({ uz: "Sanoat va hisoblovchi", ru: "Промышленные и счётные", en: "Industrial & counting" }, ["FEJ 17K-4", "FEJ 33K-4M", "FEJ 62K-4D", "FEJ 62K-4DM", "PCD 250-3", "PCD 300-3", "PCD 2500-2", "PCD 3000-2", "PCD 6K-4", "PCD 10K0.1", "PKD 10K-3"]),
    ],
  },
  {
    slug: "moisture-analyzers",
    symbol: "Ma",
    number: 8,
    brand: "KERN & SOHN",
    name: { uz: "Namlik analizatorlari", ru: "Анализаторы влажности", en: "Moisture analyzers" },
    short: { uz: "Galogen va IQ isitish", ru: "Галоген и ИК-нагрев", en: "Halogen & IR heating" },
    description: {
      uz: "Oziq-ovqat, don, farmatsevtika va polimerlarda namlikni tez aniqlash uchun termogravimetrik analizatorlar.",
      ru: "Термогравиметрические анализаторы для быстрого определения влажности пищевых продуктов, зерна, фармсубстанций и полимеров.",
      en: "Thermogravimetric analyzers for fast moisture determination in food, grain, pharmaceuticals and polymers.",
    },
    groups: [g("DAB · DBS · DLB", ["DAB 100-3", "DAB 100-3IR", "DAB 200-2", "DAB 200-2IR", "DBS 60-3", "DLB 160-3A"])],
  },
  {
    slug: "dissolution",
    symbol: "Ds",
    number: 9,
    brand: "Copley Scientific",
    name: { uz: "Dissolyutsiya va parchalanish testlari", ru: "Тесты растворения и распадаемости", en: "Dissolution & disintegration testing" },
    short: { uz: "DISi, DTGi, SDT, HDT", ru: "DISi, DTGi, SDT, HDT", en: "DISi, DTGi, SDT, HDT" },
    description: {
      uz: "Tabletka va kapsulalarning eruvchanligi hamda parchalanishini Ph. Eur. va USP talablari bo'yicha aniqlash uchun testerlar; shamchalar va yarim qattiq dori shakllari (malham, krem) uchun alohida tizimlar. Sensorli boshqaruv, PT100 harorat datchigi va past tebranishli tashqi isitgich — R&D va QC laboratoriyalari uchun.",
      ru: "Тестеры растворения и распадаемости таблеток и капсул по требованиям Ph. Eur. и USP; отдельные системы для суппозиториев и мягких лекарственных форм (мази, кремы). Сенсорное управление, датчик PT100 и внешний нагреватель с низкой вибрацией — для R&D и ОКК.",
      en: "Dissolution and disintegration testers for tablets and capsules to Ph. Eur. and USP; dedicated systems for suppositories and semisolids (ointments, creams). Touchscreen control, PT100 temperature probe and a low-vibration external heater — for R&D and QC labs.",
    },
    standards: ["Ph. Eur. 2.9.1", "Ph. Eur. 2.9.3", "USP <701>", "USP <711>", "USP <724>", "USP <1724>"],
    groups: [
      g({ uz: "Dissolyutsiya (DISi)", ru: "Растворение (DISi)", en: "Dissolution (DISi)" }, ["DIS 600i", "DIS 800i"]),
      g({ uz: "Parchalanish (DTGi)", ru: "Распадаемость (DTGi)", en: "Disintegration (DTGi)" }, ["DTG 100i", "DTG 200i", "DTG 300i", "DTG 400i", "DTG 200i-IS"]),
      g({ uz: "Shamchalar va vaginal tabletkalar", ru: "Суппозитории и вагинальные таблетки", en: "Suppositories & vaginal tablets" }, ["SDT 1000", "VTT"]),
      g({ uz: "Yarim qattiq shakllar", ru: "Мягкие лекарственные формы", en: "Semisolids" }, ["HDT 1000"]),
    ],
  },
  {
    slug: "tablet-testing",
    symbol: "Tb",
    number: 10,
    brand: "Copley Scientific",
    name: { uz: "Tabletkalarning fizik testlari", ru: "Физические тесты таблеток", en: "Tablet physical testing" },
    short: { uz: "Qattiqlik, mo'rtlik, qalinlik", ru: "Прочность, истираемость, толщина", en: "Hardness, friability, thickness" },
    description: {
      uz: "Tabletkaning sinish kuchi, ishqalanishga chidamliligi (friabilitet) va qalinligini o'lchash uchun asboblar — ishlab chiqarish sexidagi ko'chma testerlardan tortib statistik hisobotli laboratoriya tizimlarigacha.",
      ru: "Приборы для измерения прочности на излом, истираемости и толщины таблеток — от портативных тестеров для цеха до лабораторных систем со статистикой и отчётами.",
      en: "Instruments for tablet breaking force, friability and thickness — from portable testers for the production floor to lab systems with statistics and reporting.",
    },
    standards: ["Ph. Eur. 2.9.7", "Ph. Eur. 2.9.8", "Ph. Eur. 2.9.41", "USP <1216>", "USP <1217>"],
    groups: [
      g({ uz: "Mo'rtlik (friabilitet)", ru: "Истираемость", en: "Friability" }, ["FRV 110i", "FRV 210i", "Friabimat SA-400"]),
      g({ uz: "Qattiqlik (sinish kuchi)", ru: "Прочность на излом", en: "Hardness (breaking force)" }, ["TBF 100i", "TH3/200", "TH3/500"]),
      g({ uz: "Qalinlik", ru: "Толщина", en: "Thickness" }, ["Thickness Tester 547", "Thickness Tester 700", "Digital Caliper 500"]),
    ],
  },
  {
    slug: "powder-testing",
    symbol: "Pw",
    number: 11,
    brand: "Copley Scientific",
    name: { uz: "Kukunlar testi", ru: "Тестирование порошков", en: "Powder testing" },
    short: { uz: "Sochiluvchanlik va zichlik", ru: "Сыпучесть и плотность", en: "Flowability & density" },
    description: {
      uz: "Farmatsevtik substansiyalar, yordamchi moddalar va metall kukunlarining zichlashtirilgan va sochma zichligi, tabiiy qiyalik burchagi va oqib o'tish tezligini aniqlash. PTA 100i yordamchisi hisob-kitob va hisobotni avtomatlashtiradi.",
      ru: "Определение насыпной плотности и плотности после уплотнения, угла естественного откоса и скорости истечения для субстанций, вспомогательных веществ и металлических порошков. Ассистент PTA 100i автоматизирует расчёты и отчёты.",
      en: "Tapped and bulk density, angle of repose and flow-through-an-orifice for APIs, excipients and metal powders. The PTA 100i assistant automates calculations and reporting.",
    },
    standards: ["Ph. Eur. 2.9.34", "Ph. Eur. 2.9.36", "USP <616>", "USP <1174>", "ISO 3923", "ASTM B213"],
    groups: [
      g({ uz: "Zichlashtirilgan zichlik (JVi)", ru: "Плотность после уплотнения (JVi)", en: "Tapped density (JVi)" }, ["JV 120i", "JV 220i"]),
      g({ uz: "Sochiluvchanlik (PTW)", ru: "Сыпучесть (PTW)", en: "Powder flow (PTW)" }, ["PTW Angle of Repose", "PTW Flow via Cylinder", "PTW Flow via Funnel", "PTW Scott Volumeter", "PTA 100i"]),
    ],
  },
  {
    slug: "inhaler-testing",
    symbol: "Ih",
    number: 12,
    brand: "Copley Scientific",
    name: { uz: "Ingalyatsion preparatlar testi", ru: "Тестирование ингаляционных препаратов", en: "Inhaler testing" },
    short: { uz: "NGI, ACI, DUSA, avtomatika", ru: "NGI, ACI, DUSA, автоматизация", en: "NGI, ACI, DUSA, automation" },
    description: {
      uz: "Dozalangan aerozollar (MDI), kukunli ingalyatorlar (DPI), nebulayzerlar va burun spreylari uchun aerodinamik zarracha o'lchami taqsimoti (APSD) va yetkazilgan doza bir xilligi (DDU) testlari: kaskadli impaktorlar, oqim nazoratchilari, nafas simulyatorlari, vakuum nasoslar, avtomatlashtirish va ma'lumotlarni boshqarish dasturi.",
      ru: "Тесты аэродинамического распределения частиц (APSD) и однородности доставляемой дозы (DDU) для MDI, DPI, небулайзеров и назальных спреев: каскадные импакторы, контроллеры потока, симуляторы дыхания, вакуумные насосы, автоматизация и ПО для управления данными.",
      en: "Aerodynamic particle size distribution (APSD) and delivered dose uniformity (DDU) testing for MDIs, DPIs, nebulisers and nasal sprays: cascade impactors, flow controllers, breathing simulators, vacuum pumps, automation and data-management software.",
    },
    standards: ["Ph. Eur. 2.9.18", "Ph. Eur. 2.9.44", "USP <601>", "USP <1601>", "USP <1602>"],
    groups: [
      g({ uz: "Kaskadli impaktorlar (APSD)", ru: "Каскадные импакторы (APSD)", en: "Cascade impactors (APSD)" }, ["Next Generation Impactor (NGI)", "Andersen Cascade Impactor (ACI)", "Multi-Stage Liquid Impinger (MSLI)", "Glass Twin Impinger (GTI)"]),
      g({ uz: "Doza bir xilligi (DDU)", ru: "Однородность дозы (DDU)", en: "Delivered dose uniformity (DDU)" }, ["DUSA for MDIs", "DUSA for DPIs"]),
      g({ uz: "Yordamchi uskunalar", ru: "Вспомогательное оборудование", en: "Ancillaries" }, ["BAC 100i Breath Actuation Controller", "TPK 200iX Critical Flow Controller", "BRS 100i Breathing Simulator", "Flow Rate Sensor FRS", "Flow Meter DFM 2000", "LCP7 Vacuum Pump", "HCP7 Vacuum Pump", "EnviroMate Environmental Chamber"]),
      g({ uz: "Avtomatlashtirish va dasturiy ta'minot", ru: "Автоматизация и ПО", en: "Automation & software" }, ["SRS 100i Sample Recovery System", "Vertus III", "Inhaled Dissolution Apparatus (IDA)", "Inhalytix+"]),
    ],
  },
];

export const modelCount = (c: Category) => c.groups.reduce((n, gr) => n + gr.models.length, 0);
export const totalModels = categories.reduce((n, c) => n + modelCount(c), 0);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const featured: { name: string; slug: string; tag: string; spec: T }[] = [
  { name: "Spinsolve 90", slug: "nmr", tag: "90 MHz", spec: { uz: "Kriogensiz stol ustidagi YaMR", ru: "Настольный ЯМР без криогеники", en: "Cryogen-free benchtop NMR" } },
  { name: "timsTOF Pro 2", slug: "mass-spectrometry", tag: "TIMS · QTOF", spec: { uz: "4D-proteomika uchun", ru: "Для 4D-протеомики", en: "Built for 4D proteomics" } },
  { name: "DIS 800i", slug: "dissolution", tag: "USP <711>", spec: { uz: "8 idishli dissolyutsiya testeri", ru: "8-сосудный тестер растворения", en: "8-vessel dissolution tester" } },
  { name: "AZURA UHPLC", slug: "hplc", tag: "DAD · 6.1 L", spec: { uz: "Ultra yuqori bosimli xromatografiya", ru: "Сверхвысокое давление", en: "Ultra-high pressure LC" } },
  { name: "Next Generation Impactor (NGI)", slug: "inhaler-testing", tag: "Ph. Eur. 2.9.18", spec: { uz: "Ingalyatorlar uchun kaskadli impaktor", ru: "Каскадный импактор для ингаляторов", en: "Cascade impactor for inhalers" } },
  { name: "KERN ABP 100-5DM", slug: "balances", tag: "0.01 mg", spec: { uz: "Semi-mikro analitik tarozi", ru: "Полумикро аналитические весы", en: "Semi-micro analytical balance" } },
  { name: "DART JumpShot", slug: "mass-spectrometry", tag: "Ambient MS", spec: { uz: "Minimal namuna tayyorlash", ru: "Минимальная пробоподготовка", en: "Minimal sample prep" } },
  { name: "TBF 100i", slug: "tablet-testing", tag: "0–490 N", spec: { uz: "Tabletka qattiqligi testeri", ru: "Тестер прочности таблеток", en: "Tablet hardness tester" } },
  { name: "LGC CRM", slug: "reference-materials", tag: "ISO 17034", spec: { uz: "CoA bilan standart namunalar", ru: "Стандартные образцы с CoA", en: "Reference materials with CoA" } },
];

export const services: { icon: string; title: T; text: T }[] = [
  {
    icon: "sugar",
    title: { uz: "Shakar miqdorini aniqlash", ru: "Определение содержания сахаров", en: "Sugar content determination" },
    text: { uz: "Turli namunalarda mono- va disaxaridlarni identifikatsiya qilish va miqdoriy aniqlash.", ru: "Идентификация и количественное определение моно- и дисахаридов в различных образцах.", en: "Identification and quantitation of mono- and disaccharides across sample types." },
  },
  {
    icon: "food",
    title: { uz: "Oziq-ovqat molekulyar tahlili", ru: "Молекулярный анализ пищевой продукции", en: "Molecular analysis of food" },
    text: { uz: "Oziq-ovqat xavfsizligi va sifatini nazorat qilish: kontaminantlar, qalbakilashtirish, tarkib.", ru: "Контроль безопасности и качества: контаминанты, фальсификация, состав.", en: "Food safety and quality: contaminants, adulteration and composition." },
  },
  {
    icon: "pill",
    title: { uz: "Farmatsevtika molekulyar tahlili", ru: "Молекулярный анализ фармпродукции", en: "Molecular analysis of pharmaceuticals" },
    text: { uz: "Faol moddalar, aralashmalar va dori vositalarining sifat nazorati.", ru: "Контроль качества АФИ, примесей и лекарственных средств.", en: "Quality control of APIs, impurities and finished drug products." },
  },
  {
    icon: "drop",
    title: { uz: "Biologik suyuqliklar tahlili", ru: "Анализ биологических жидкостей", en: "Analysis of biological fluids" },
    text: { uz: "Qon, siydik, so'lak va boshqa suyuqliklardan biomarkerlarni aniqlash.", ru: "Поиск биомаркеров в крови, моче, слюне и других жидкостях.", en: "Biomarker discovery in blood, urine, saliva and other fluids." },
  },
  {
    icon: "ml",
    title: { uz: "Mashinali o'qitish uchun ma'lumotlar", ru: "Данные для машинного обучения", en: "Machine learning data" },
    text: { uz: "Analitik ma'lumotlarni tayyorlash va ML modellarini qurish (MLaaS).", ru: "Подготовка аналитических данных и построение ML-моделей (MLaaS).", en: "Preparing analytical datasets and building ML models (MLaaS)." },
  },
  {
    icon: "chart",
    title: { uz: "Statistik ma'lumotlar tahlili", ru: "Статистический анализ данных", en: "Statistical data analysis" },
    text: { uz: "Murakkab ma'lumotlar to'plamidan ishonchli xulosalar: kemometrika, ko'p o'lchovli tahlil.", ru: "Надёжные выводы из сложных данных: хемометрика, многомерный анализ.", en: "Reliable insight from complex datasets: chemometrics and multivariate analysis." },
  },
  {
    icon: "method",
    title: { uz: "Yangi analitik metodlar yaratish", ru: "Разработка новых аналитических методик", en: "New analytical method development" },
    text: { uz: "Vazifangiz uchun metodikani noldan ishlab chiqamiz: namuna tayyorlash, xromatografik va spektral sharoitlarni optimallashtirish, ICH Q2(R2) bo'yicha validatsiya va metodni laboratoriyangizga o'tkazish.", ru: "Разрабатываем методику под вашу задачу с нуля: пробоподготовка, оптимизация хроматографических и спектральных условий, валидация по ICH Q2(R2) и перенос методики в вашу лабораторию.", en: "We develop methods for your task from scratch: sample preparation, chromatographic and spectral optimisation, validation to ICH Q2(R2) and transfer to your lab." },
  },
  {
    icon: "wrench",
    title: { uz: "Servis va validatsiya", ru: "Сервис и валидация", en: "Maintenance & validation" },
    text: { uz: "Yuqori sezgir uskunalarga texnik xizmat, kalibrlash va IQ/OQ/PQ validatsiyasi.", ru: "ТО, калибровка и валидация IQ/OQ/PQ высокочувствительного оборудования.", en: "Maintenance, calibration and IQ/OQ/PQ validation of sensitive instruments." },
  },
  {
    icon: "qualify",
    title: { uz: "Dissolyutsiya testerlari kvalifikatsiyasi", ru: "Квалификация тестеров растворения", en: "Dissolution tester qualification" },
    text: { uz: "Mexanik kvalifikatsiya (MQ) va PVT: val tezligi, tebranish, markazlashuv, harorat — farmakopeya talablari bo'yicha hujjatlangan hisobot bilan.", ru: "Механическая квалификация (MQ) и PVT: скорость вала, вибрация, центровка, температура — с документированным отчётом по фармакопее.", en: "Mechanical qualification (MQ) and PVT: shaft speed, vibration, centring and temperature — with a documented pharmacopoeial report." },
  },
  {
    icon: "training",
    title: { uz: "Metodik o'qitish", ru: "Методическое обучение", en: "Method training" },
    text: { uz: "Dissolyutsiya, kukun va ingalyatsion testlar bo'yicha amaliy kurslar: usulni ishlab chiqish, validatsiya va natijalarni talqin qilish.", ru: "Практические курсы по растворению, порошкам и ингаляционным тестам: разработка методик, валидация и интерпретация результатов.", en: "Hands-on courses in dissolution, powder and inhaler testing: method development, validation and data interpretation." },
  },
];

export const applications: T[] = [
  { uz: "Qishloq xo'jaligi", ru: "Сельское хозяйство", en: "Agriculture" },
  { uz: "Akvakultura", ru: "Аквакультура", en: "Aquaculture" },
  { uz: "Biotexnologiya", ru: "Биотехнологии", en: "Biotechnology" },
  { uz: "Bioximiya", ru: "Биохимия", en: "Biochemistry" },
  { uz: "Bioprotsesslar", ru: "Биопроцессы", en: "Bioprocessing" },
  { uz: "Biotibbiyot", ru: "Биомедицина", en: "Biomedical" },
  { uz: "Kimyo", ru: "Химия", en: "Chemistry" },
  { uz: "Muhandislik", ru: "Инженерия", en: "Engineering" },
  { uz: "Oziq-ovqat", ru: "Пищевая отрасль", en: "Food" },
  { uz: "Yem-xashak", ru: "Корма", en: "Feed" },
  { uz: "Farmatsevtika", ru: "Фармацевтика", en: "Pharma" },
  { uz: "Sog'liqni saqlash", ru: "Здравоохранение", en: "Public health" },
];

export const brands = ["Bruker", "Magritek", "KNAUER", "KERN & SOHN", "LGC Standards", "Copley Scientific"];
