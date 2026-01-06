import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

import { LocaleType } from "@/models/types/locale";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/models/constants/locale";

const locales: LocaleType[] = [...SUPPORTED_LOCALES];
const defaultLocale: LocaleType = DEFAULT_LOCALE;
const cookieName = "NEXT_LOCALE";

/**
 * Extracts locale from request headers
 *
 * Uses Accept-Language header to determine preferred locale.
 * Falls back to default locale if no match found.
 *
 * @param request - Next.js request object
 * @returns Locale string ("pt" or "en")
 */
function getLocaleFromHeaders(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  return matchLocale(languages, locales, defaultLocale);
}

/**
 * Extracts locale from pathname
 *
 * Checks if pathname starts with a locale prefix.
 *
 * @param pathname - Request pathname
 * @returns Locale string if found, null otherwise
 */
function getLocaleFromPathname(pathname: string): string | null {
  const locale = locales.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );
  return locale || null;
}

/**
 * Next.js middleware proxy function
 *
 * Handles internationalization routing and locale detection.
 * Redirects requests to locale-prefixed paths and sets locale cookies.
 * Protects static files (robots.txt, sitemap.xml) from redirection.
 *
 * @param request - Next.js request object
 * @returns NextResponse with locale handling applied
 */
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

/**
 * Middleware configuration
 *
 * Matches all routes except API routes, Next.js static files, and favicon.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
