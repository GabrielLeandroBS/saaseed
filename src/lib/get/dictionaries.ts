import enAuth from "@/locales/en/auth.json";
import enDashboard from "@/locales/en/dashboard.json";
import enErrors from "@/locales/en/errors.json";
import enGeneric from "@/locales/en/generic.json";
import enPlaceholder from "@/locales/en/placeholder.json";
import enSidebar from "@/locales/en/sidebar.json";
import enSuccess from "@/locales/en/success.json";
import ptAuth from "@/locales/pt/auth.json";
import ptDashboard from "@/locales/pt/dashboard.json";
import ptErrors from "@/locales/pt/errors.json";
import ptGeneric from "@/locales/pt/generic.json";
import ptPlaceholder from "@/locales/pt/placeholder.json";
import ptSidebar from "@/locales/pt/sidebar.json";
import ptSuccess from "@/locales/pt/success.json";

import "server-only";
import { LocaleType } from "@/models/types/locale";

const dictionaries = {
  en: {
    authentication: enAuth,
    dashboard: enDashboard,
    errors: enErrors,
    generic: enGeneric,
    placeholder: enPlaceholder,
    sidebar: enSidebar,
    success: enSuccess,
  },
  pt: {
    authentication: ptAuth,
    dashboard: ptDashboard,
    errors: ptErrors,
    generic: ptGeneric,
    placeholder: ptPlaceholder,
    sidebar: ptSidebar,
    success: ptSuccess,
  },
};

export type DictionaryType = typeof dictionaries.en | typeof dictionaries.pt;
export const getDictionary = async (
  locale: LocaleType,
): Promise<DictionaryType> => {
  try {
    const dictionary = dictionaries[locale] || dictionaries.pt;
    if (!dictionary) {
      return dictionaries.pt;
    }
    return dictionary;
  } catch (error) {
    console.error(error);
    return dictionaries.pt;
  }
};
