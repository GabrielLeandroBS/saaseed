import i18next from "i18next";
import Cookies from "js-cookie";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";

import translationEn from "zod-i18n-map/locales/en/zod.json";
import translationPt from "zod-i18n-map/locales/pt/zod.json";

const getCookieLang = Cookies.get("NEXT_LOCALE");

i18next.init({
  lng: getCookieLang,
  resources: {
    en: { zod: translationEn },
    pt: { zod: translationPt },
  },
});
z.setErrorMap(zodI18nMap);

export { z };
