import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/_next/*",
          "/static/*",
          "/*/dashboard/*",
          "/*/sign-in",
          "/*/sign-up",
          "/*/forgot-password",
          "/*/reset-password/*",
        ],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
