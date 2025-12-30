import { DictionaryType } from "@/lib/get/dictionaries";
import { LocaleType } from "@/models/types/locale";

export type AuthFormMode = "sign-in" | "sign-up";

export interface AuthFormProps extends React.ComponentProps<"div"> {
  mode: AuthFormMode;
  translation: DictionaryType;
  lang?: LocaleType;
  token?: string;
}
