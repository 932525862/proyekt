import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, type Locale } from "@/lib/i18n";

/** Accept-Language sarlavhasidan eng mos tilni tanlaydi (q-qiymatlari bo'yicha) */
function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = Number(params.find((x) => x.trim().startsWith("q="))?.split("=")[1] ?? 1);
      return { lang: tag.split("-")[0], q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.map((r) => r.lang).find((l): l is Locale => isLocale(l));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return;

  const saved = request.cookies.get(localeCookie)?.value;
  const lang = (saved && isLocale(saved) ? saved : undefined) ?? fromAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // API, Next ichki fayllari va statik fayllar (nuqtali yo'llar) bundan mustasno
  matcher: ["/((?!api|_next|images|.*\\..*).*)"],
};
