import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { ThemeProvider } from "@/components/container/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "@/app/globals.css";
import { LayoutProps } from "@/models/types/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Template - Next.js",
    template: "%s | Template",
  },
  description: "A modern web application template built with Next.js",
  keywords: ["next.js", "react", "template", "web application"],
  authors: [{ name: "Template Team" }],
  creator: "Template Team",
  publisher: "Template",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.template.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "pt-BR": "/pt",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.template.com",
    title: "Template - Next.js Application",
    description: "A modern web application template built with Next.js",
    siteName: "Template",
  },
  twitter: {
    card: "summary_large_image",
    title: "Template - Next.js Application",
    description: "A modern web application template built with Next.js",
    creator: "@template",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // You'll need to add the actual verification code here
  },
};

const Layout = async ({ children }: LayoutProps) => {
  const getCookieLang = (await cookies()).get("NEXT_LOCALE");

  return (
    <html lang={getCookieLang?.value} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
};

export default Layout;
