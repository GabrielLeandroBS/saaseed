import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Generates robots.txt metadata
 *
 * Configures which paths search engines can crawl.
 * Disallows API routes, internal pages, and authentication pages.
 *
 * @returns MetadataRoute.Robots configuration
 */
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
        ],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
