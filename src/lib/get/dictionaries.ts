import { cache } from "react";
import "server-only";
import { LocaleType } from "@/models/types/locale";

// Lazy load dictionaries to improve performance
const loadDictionary = async (locale: LocaleType) => {
  if (locale === "en") {
    const [
      enAuth,
      enCommon,
      enDashboard,
      enErrors,
      enGeneric,
      enPlaceholder,
      enSidebar,
      enSuccess,
    ] = await Promise.all([
      import("@/locales/en/auth.json"),
      import("@/locales/en/common.json"),
      import("@/locales/en/dashboard.json"),
      import("@/locales/en/errors.json"),
      import("@/locales/en/generic.json"),
      import("@/locales/en/placeholder.json"),
      import("@/locales/en/sidebar.json"),
      import("@/locales/en/success.json"),
    ]);

    return {
      authentication: enAuth.default,
      common: enCommon.default,
      dashboard: enDashboard.default,
      errors: enErrors.default,
      generic: enGeneric.default,
      placeholder: enPlaceholder.default,
      sidebar: enSidebar.default,
      success: enSuccess.default,
    };
  }

  // Default to Portuguese
  const [
    ptAuth,
    ptCommon,
    ptDashboard,
    ptErrors,
    ptGeneric,
    ptPlaceholder,
    ptSidebar,
    ptSuccess,
  ] = await Promise.all([
    import("@/locales/pt/auth.json"),
    import("@/locales/pt/common.json"),
    import("@/locales/pt/dashboard.json"),
    import("@/locales/pt/errors.json"),
    import("@/locales/pt/generic.json"),
    import("@/locales/pt/placeholder.json"),
    import("@/locales/pt/sidebar.json"),
    import("@/locales/pt/success.json"),
  ]);

  return {
    authentication: ptAuth.default,
    common: ptCommon.default,
    dashboard: ptDashboard.default,
    errors: ptErrors.default,
    generic: ptGeneric.default,
    placeholder: ptPlaceholder.default,
    sidebar: ptSidebar.default,
    success: ptSuccess.default,
  };
};

export type DictionaryType = Awaited<ReturnType<typeof loadDictionary>>;

export const getDictionary = cache(
  async (locale: LocaleType): Promise<DictionaryType> => {
    return loadDictionary(locale);
  },
);
