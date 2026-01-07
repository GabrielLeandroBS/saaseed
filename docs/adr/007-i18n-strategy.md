# ADR-007: Internationalization Strategy

## Status

Accepted

## Context

The project needs:

- Support for multiple languages (PT, EN)
- Localized URLs (`/pt/dashboard`, `/en/dashboard`)
- Translated form validation
- SEO optimized for each language

## Decision

We adopted an i18n strategy based on:

- **Route segments**: `[lang]` for locale in URL
- **JSON dictionaries**: Translation files by namespace
- **Zod i18n**: Translated validation messages
- **Cookies**: Language preference persistence

## Alternatives Considered

### next-intl

- **Pros**: Very complete, ICU message format, good DX
- **Cons**: Larger bundle size, more complex

### react-i18next

- **Pros**: Very popular, many features
- **Cons**: Complex configuration with App Router

### Paraglide.js

- **Pros**: Type-safe, compile-time, small
- **Cons**: Less mature, fewer examples

### Lingui

- **Pros**: ICU format, automatic extraction
- **Cons**: Learning curve, specific tooling

## Consequences

### Positive

1. **Simple**: JSON files are easy to edit
2. **Type-safe**: TypeScript interfaces for dictionaries
3. **Performance**: Lazy loading of translations
4. **SEO**: Localized URLs with hreflang
5. **Zod integration**: Validations automatically translated

### Negative

1. **Manual**: No automatic string extraction
2. **Plurals**: Need manual logic for pluralization
3. **Formatting**: No ICU message format

## Implementation

### File Structure

```
src/locales/
├── en/
│   ├── auth.json
│   ├── common.json
│   ├── dashboard.json
│   ├── errors.json
│   ├── generic.json
│   ├── placeholder.json
│   ├── sidebar.json
│   └── success.json
└── pt/
    └── ... (same structure)
```

### Dictionary Loader

```typescript
// src/lib/i18n/dictionaries.ts
export const getDictionary = cache(async (locale: LocaleType) => {
  const [auth, common, ...] = await Promise.all([
    import(`@/locales/${locale}/auth.json`),
    import(`@/locales/${locale}/common.json`),
    // ...
  ]);

  return {
    authentication: auth.default,
    common: common.default,
    // ...
  };
});
```

### Usage in Server Components

```typescript
// src/app/[lang]/dashboard/page.tsx
export default async function DashboardPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <h1>{dict.dashboard.title}</h1>;
}
```

### Usage in Client Components

```typescript
// Pass translations as props
<AuthForm translation={dict} mode="sign-in" />
```

### Zod i18n

```typescript
// src/lib/zod.ts
import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translationEn from "zod-i18n-map/locales/en/zod.json";
import translationPt from "zod-i18n-map/locales/pt/zod.json";

i18next.init({
  lng: Cookies.get("NEXT_LOCALE"),
  resources: {
    en: { zod: translationEn },
    pt: { zod: translationPt },
  },
});

z.setErrorMap(zodI18nMap);
```

### Middleware (Proxy)

```typescript
// src/proxy.ts
// Detects locale from cookie or Accept-Language header
// Redirects routes without locale prefix to /${locale}/${route}
// Stores preference in NEXT_LOCALE cookie (30 days)
```

**Important**: When navigating within the app, you don't need to include the locale prefix in URLs. The proxy middleware automatically handles this:

```typescript
// ✅ Correct - proxy adds locale prefix automatically
router.push(`/${FrontendRoutesEnum.DASHBOARD}`);
<Link href={`/${FrontendRoutesEnum.SIGN_IN}`}>Sign In</Link>

// ❌ Incorrect - don't hardcode locale
router.push(`/${lang}/${FrontendRoutesEnum.DASHBOARD}`);
```

This simplifies components by removing the need to pass `lang` through props just for navigation.

### SEO

```typescript
// src/app/layout.tsx
export const metadata = {
  alternates: {
    languages: {
      "en-US": "/en",
      "pt-BR": "/pt",
    },
  },
};
```

### TypeScript Types

```typescript
// src/models/types/i18n.ts
export interface DictionaryType {
  authentication: AuthDictionary;
  common: CommonDictionary;
  dashboard: DashboardDictionary;
  // ...
}
```

## References

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [zod-i18n-map](https://github.com/aiji42/zod-i18n)
