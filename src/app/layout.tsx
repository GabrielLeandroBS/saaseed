import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { env } from "@/env";

import "@/app/globals.css";
import { LayoutProps } from "@/models/types/layout";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Production-Ready SaaS Boilerplate`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: siteConfig.category,
  applicationName: siteConfig.name,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "pt-BR": "/pt",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    url: siteConfig.siteUrl,
    title: `${siteConfig.name} - Launch Your SaaS Faster`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - SaaS Boilerplate`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Production-Ready SaaS Boilerplate`,
    description: siteConfig.description,
    creator: siteConfig.links.twitter.replace("https://twitter.com/", "@"),
    site: siteConfig.links.twitter.replace("https://twitter.com/", "@"),
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": siteConfig.shortName,
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": siteConfig.themeColor,
    "msapplication-config": "/browserconfig.xml",
    "theme-color": siteConfig.themeColor,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: siteConfig.themeColor,
      },
    ],
  },
  manifest: "/site.webmanifest",
};

/**
 * Root layout component
 *
 * Wraps entire application with providers (Theme, Query, etc.).
 * Configures fonts, metadata, and global styles.
 * Handles locale detection from cookies.
 *
 * @param children - React children to render
 * @returns Root layout JSX
 */
const Layout = async ({ children }: LayoutProps) => {
  const getCookieLang = (await cookies()).get("NEXT_LOCALE");

  return (
    <html lang={getCookieLang?.value} suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex items-center justify-center min-h-screen bg-background">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default Layout;
