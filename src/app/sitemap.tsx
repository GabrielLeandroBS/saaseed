import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { SUPPORTED_LOCALES } from "@/models/constants/locale";
import type { ChangeFreq } from "@/models/types/sitemap";

/**
 * Generates sitemap.xml metadata
 *
 * Creates sitemap entries for all supported locales.
 * Sets daily change frequency and high priority for home pages.
 *
 * @returns MetadataRoute.Sitemap with all locale routes
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    routes.push({
      url: `${siteConfig.siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as ChangeFreq,
      priority: 1,
    });
  }

  return routes;
}
