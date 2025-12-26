import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";
import { LocaleType } from "@/models/types/locale";

// Define supported locales
const locales: LocaleType[] = ["pt", "en"];
const defaultLocale: LocaleType = "pt"; // Default fallback locale
const cookieName = "NEXT_LOCALE"; // Name of the cookie to store the locale

// Auth routes that should redirect to dashboard if user is authenticated
const authRoutes = [
  FrontendRoutesEnum.SIGN_IN,
  FrontendRoutesEnum.SIGN_UP,
  FrontendRoutesEnum.FORGOT_PASSWORD,
];

// Function to get the best locale from the request headers
function getLocaleFromHeaders(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );
  return matchLocale(languages, locales, defaultLocale);
}

// Function to get the locale from the pathname
function getLocaleFromPathname(pathname: string): string | null {
  const locale = locales.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );
  return locale || null;
}

// Function to check if path is an auth route
function isAuthRoute(path: string): boolean {
  return authRoutes.some((route) => path.includes(route));
}

// Function to check if path is a dashboard route
function isDashboardRoute(path: string): boolean {
  return path.includes(FrontendRoutesEnum.DASHBOARD);
}

// Function to check if path is a special file that needs locale handling
function isSpecialFile(path: string): boolean {
  return path.endsWith("robots.txt") || path.endsWith("sitemap.xml");
}

// Middleware function
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale redirection for robots.txt and sitemap.xml
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  // Handle special files (robots.txt and sitemap.xml)
  if (isSpecialFile(pathname)) {
    const locale =
      getLocaleFromPathname(pathname) || getLocaleFromHeaders(request);
    const newPath = `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check if user is authenticated by checking for better-auth session cookie
  // Better Auth stores session in a cookie named "better-auth.session_token"
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = !!sessionCookie;

  // Handle authentication redirects
  if (isAuthenticated) {
    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (isAuthRoute(pathname)) {
      const locale =
        getLocaleFromPathname(pathname) || getLocaleFromHeaders(request);
      return NextResponse.redirect(
        new URL(
          `/${locale}${FrontendRoutesEnum.DASHBOARD}`,
          request.url,
        ),
      );
    }
  } else {
    // If user is not authenticated and trying to access dashboard, redirect to sign-in
    if (isDashboardRoute(pathname)) {
      const locale =
        getLocaleFromPathname(pathname) || getLocaleFromHeaders(request);
      return NextResponse.redirect(
        new URL(`/${locale}${FrontendRoutesEnum.SIGN_IN}`, request.url),
      );
    }
  }

  // Handle internationalization
  const localeFromPath = getLocaleFromPathname(pathname);
  const localeFromCookie = request.cookies.get(cookieName)?.value;

  let response: NextResponse;

  if (localeFromPath) {
    // If the pathname includes a locale (e.g., /en, /pt), set it in the cookie
    response = NextResponse.next();
    response.cookies.set(cookieName, localeFromPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // If no locale in the pathname, use the cookie or fallback to header-based locale
  const locale = localeFromCookie || getLocaleFromHeaders(request);

  // Redirect to the same pathname prefixed with the determined locale
  request.nextUrl.pathname = `/${locale}${pathname}`;
  response = NextResponse.redirect(request.nextUrl);

  // Ensure the cookie is set for future requests
  if (!localeFromCookie) {
    response.cookies.set(cookieName, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

// Config to define middleware behavior
export const config = {
  matcher: [
    // Apply to all paths except internal Next.js paths, API routes, and static assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
