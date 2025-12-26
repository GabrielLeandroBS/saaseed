import type { NextConfig } from "next";

// Import env to validate environment variables on build/dev/start
// This ensures all required env vars are present before the app starts
import "@/env";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "@radix-ui/react-toast",
    ],
    webVitalsAttribution: ["CLS", "LCP", "FID", "INP"],
  },
  serverExternalPackages: ["sharp"],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  reactStrictMode: true,
} satisfies NextConfig;

export default nextConfig;
