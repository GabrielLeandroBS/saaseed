import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";

type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as ChangeFreq,
      priority: 1,
    },
  ];

  const filteredRoutes = routes.filter(
    (route) =>
      !route.url.includes(FrontendRoutesEnum.SIGN_IN) &&
      !route.url.includes(FrontendRoutesEnum.SIGN_UP) &&
      !route.url.includes(FrontendRoutesEnum.FORGOT_PASSWORD) &&
      !route.url.includes(FrontendRoutesEnum.DASHBOARD),
  );

  return filteredRoutes;
}
