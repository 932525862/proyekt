import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Suspense } from "react";
import { Header, HeaderStatic } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { alternates, company, getDictionary, isLocale, locales, ogLocales, siteUrl } from "@/lib/i18n";
import { getCatalog, getContacts } from "@/lib/data";
import { organizationGraph } from "@/lib/seo";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: d.meta.title, template: `%s | ${company.name}` },
    description: d.meta.description,
    keywords: d.meta.keywords,
    applicationName: company.name,
    authors: [{ name: company.name, url: siteUrl }],
    creator: company.name,
    publisher: company.name,
    category: "science",
    alternates: alternates(lang),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      title: d.meta.title,
      description: d.meta.description,
      type: "website",
      url: `/${lang}`,
      siteName: company.name,
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
    },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description },
    formatDetection: { telephone: true, email: true, address: false },
    // Search Console / Yandex.Webmaster tasdiqlash kodlari (muhit o'zgaruvchilaridan)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#07111d" },
  ],
  colorScheme: "light dark",
};

// Sahifa chizilishidan oldin mavzuni qo'llaydi (miltillashsiz)
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [cats, contacts] = await Promise.all([getCatalog(), getContacts()]);

  return (
    <html lang={lang} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={organizationGraph(lang, cats, contacts)} />
      </head>
      <body id="top" className="min-h-dvh overflow-x-hidden">
        <Suspense fallback={<HeaderStatic lang={lang} nav={dict.nav} hours={dict.contact.hoursV} address={dict.contact.addressV} contacts={contacts} />}>
          <Header lang={lang} nav={dict.nav} hours={dict.contact.hoursV} address={dict.contact.addressV} contacts={contacts} />
        </Suspense>
        <main>{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}
