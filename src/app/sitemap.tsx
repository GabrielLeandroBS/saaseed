import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

const locales = ["pt", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Adiciona rotas para cada locale
  for (const locale of locales) {
    routes.push({
      url: `${siteConfig.siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as ChangeFreq,
      priority: 1,
    });
  }

  return routes;
}
