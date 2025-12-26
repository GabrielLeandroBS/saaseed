import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";

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
          FrontendRoutesEnum.DASHBOARD + "/*",
          FrontendRoutesEnum.SIGN_IN + "*",
          FrontendRoutesEnum.SIGN_UP + "*",
          FrontendRoutesEnum.FORGOT_PASSWORD,
        ],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
