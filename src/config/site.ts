/**
 * Site configuration object
 *
 * Contains metadata, navigation, links, and keywords for the application.
 * Used for SEO, metadata generation, and site-wide settings.
 */
export const siteConfig = {
  name: "SaaSeed",
  shortName: "SaaSeed",
  description:
    "Production-ready SaaS boilerplate with Next.js 15, Better Auth, Stripe subscriptions, Supabase, and i18n. Launch your startup faster with authentication, payments, and dashboard out of the box.",
  emoji: "🌱",
  backgroundColor: "#09090b",
  themeColor: "#10b981",
  siteUrl: "https://saaseed.dev",
  category: "SaaS Boilerplate",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/saaseed",
    telegram: "https://t.me/saaseed",
    github: "https://github.com/saaseed/saaseed",
    docs: "https://docs.saaseed.dev",
    linkedin: "https://linkedin.com/company/saaseed",
    blog: "https://blog.saaseed.dev",
  },
  keywords: [
    // Primary keywords
    "saas boilerplate",
    "saas starter kit",
    "saas template",
    "nextjs saas",
    "nextjs boilerplate",
    "nextjs starter",

    // Technology stack
    "next.js 15",
    "react 19",
    "typescript",
    "tailwind css",
    "shadcn ui",

    // Features
    "stripe integration",
    "stripe subscriptions",
    "payment processing",
    "better auth",
    "authentication",
    "magic link login",
    "oauth",
    "google login",
    "supabase",
    "supabase database",

    // Technical features
    "server components",
    "app router",
    "internationalization",
    "i18n",
    "multi-language",
    "dark mode",
    "responsive design",
    "seo optimized",

    // Use cases
    "startup template",
    "mvp starter",
    "production ready",
    "developer tools",
    "web application",
    "dashboard template",
    "admin panel",

    // Additional
    "open source",
    "full stack",
    "monorepo",
    "vercel deployment",
    "edge functions",
  ],
  // Structured data for rich snippets
  structuredData: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SaaSeed",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
};
