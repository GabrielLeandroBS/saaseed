import { ReactNode } from "react";

import { DictionaryType } from "@/lib/get/dictionaries";
import { LocaleType } from "@/models/types/locale";

export interface AuthProps extends React.ComponentProps<"div"> {
  translation: DictionaryType;
  lang?: LocaleType;
  token?: string;
  children?: ReactNode;
}
