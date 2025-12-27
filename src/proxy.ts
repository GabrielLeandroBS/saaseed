import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

import { LocaleType } from "@/models/types/locale";

const locales: LocaleType[] = ["pt", "en"];
const defaultLocale: LocaleType = "pt";
const cookieName = "NEXT_LOCALE";

function getLocaleFromHeaders(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );
  return matchLocale(languages, locales, defaultLocale);
}

function getLocaleFromPathname(pathname: string): string | null {
  const locale = locales.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );
  return locale || null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  const localeFromPath = getLocaleFromPathname(pathname);
  const localeFromCookie = request.cookies.get(cookieName)?.value;

  if (localeFromPath) {
    const response = NextResponse.next();
    response.cookies.set(cookieName, localeFromPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  const locale = localeFromCookie || getLocaleFromHeaders(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);

  if (!localeFromCookie) {
    response.cookies.set(cookieName, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
