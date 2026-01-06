import type { NextConfig } from "next";

import { env } from "@/env";

const isProduction = env.NODE_ENV === "production";
const isDevelopment = env.NODE_ENV === "development";

/**
 * Content Security Policy configuration
 *
 * Defines trusted sources for scripts, styles, images, and other resources.
 * Uses 'unsafe-inline' for styles (required by Tailwind CSS).
 * Uses 'unsafe-eval' in development for hot reload.
 */
const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "https://js.stripe.com",
    "https://accounts.google.com",
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://*.supabase.co",
    "https://*.googleusercontent.com",
    "https://*.stripe.com",
  ],
  "font-src": ["'self'"],
  "connect-src": [
    "'self'",
    "https://*.supabase.co",
    "https://api.stripe.com",
    "https://accounts.google.com",
    "https://*.sentry.io",
    "https://*.ingest.sentry.io",
    ...(isDevelopment ? ["ws://localhost:3000"] : []),
  ],
  "frame-src": [
    "'self'",
    "https://js.stripe.com",
    "https://accounts.google.com",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"],
  "upgrade-insecure-requests": isProduction ? [] : undefined,
};

const contentSecurityPolicy = Object.entries(cspDirectives)
  .filter(([, value]) => value !== undefined)
  .map(([key, value]) => {
    if (Array.isArray(value) && value.length === 0) {
      return key;
    }
    return `${key} ${(value as string[]).join(" ")}`;
  })
  .join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole: isProduction
      ? {
          exclude: ["error", "warn"],
        }
      : false,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: isProduction
        ? [env.BETTER_AUTH_URL]
        : ["localhost:3000", "127.0.0.1:3000"],
    },

    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "date-fns",
      "recharts",
      "sonner",
    ],

    webVitalsAttribution: ["CLS", "LCP", "FID", "INP", "TTFB"],
    optimizeCss: isProduction,
    ppr: false,
    serverComponentsHmrCache: isDevelopment,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },

  serverExternalPackages: ["sharp", "@supabase/supabase-js"],

  output: isProduction ? "standalone" : undefined,

  compress: true,
  poweredByHeader: false,

  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value: contentSecurityPolicy,
        },
        ...(isProduction
          ? [
              {
                key: "Strict-Transport-Security",
                value: "max-age=31536000; includeSubDomains; preload",
              },
            ]
          : []),
      ],
    },
  ],

  logging: {
    fetches: {
      fullUrl: isDevelopment,
    },
  },

  typescript: {
    ignoreBuildErrors: false,
  },
} satisfies NextConfig;

export default nextConfig;
