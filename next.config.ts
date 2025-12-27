import type { NextConfig } from "next";

// Import env to validate environment variables on build/dev/start
// This ensures all required env vars are present before the app starts
import "@/env";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // React Configuration
  reactStrictMode: true,

  // Compiler Optimizations
  compiler: {
    // Remove console logs in production (except error and warn)
    removeConsole: isProduction
      ? {
          exclude: ["error", "warn"],
        }
      : false,
  },

  // Experimental Features
  experimental: {
    // Server Actions Configuration
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: isProduction
        ? [process.env.BETTER_AUTH_URL || ""]
        : ["localhost:3000", "127.0.0.1:3000"],
    },

    // Optimize package imports for tree-shaking
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "@radix-ui/react-toast",
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

    // Web Vitals Attribution for better performance monitoring
    webVitalsAttribution: ["CLS", "LCP", "FID", "INP", "TTFB"],

    // Optimize server components
    optimizeCss: isProduction,

    // Enable partial prerendering (if available)
    ppr: false,
  },

  // Image Optimization
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

  // Server Configuration
  serverExternalPackages: ["sharp", "postgres", "@supabase/supabase-js"],

  // Output Configuration
  // Use "standalone" for Docker deployments or self-hosting
  // Remove this line if deploying to Vercel or other platforms that handle this automatically
  // output: "standalone",

  // Compression
  compress: true,

  // PoweredBy Header (Security)
  poweredByHeader: false,

  // Headers Configuration
  async headers() {
    return [
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
        ],
      },
    ];
  },

  // Redirects Configuration
  async redirects() {
    return [];
  },

  // Rewrites Configuration
  async rewrites() {
    return [];
  },

  // Transpile packages that need to be processed by Babel
  // Next.js 16 uses Turbopack by default, which handles optimizations automatically
  transpilePackages: [],

  // Logging Configuration
  logging: {
    fetches: {
      fullUrl: isDevelopment,
    },
  },

  // TypeScript Configuration
  typescript: {
    // Next.js will type-check during build (recommended)
    // Set to true only if you have a separate type-check step in CI/CD
    // and want faster builds (not recommended for production)
    ignoreBuildErrors: false,
  },
} satisfies NextConfig;

export default nextConfig;
