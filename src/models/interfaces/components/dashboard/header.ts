import { DictionaryType } from "@/lib/get/dictionaries";

export const COMMAND_SHORTCUT_KEY = "k" as const;

export interface DashboardHeaderProps extends React.HTMLAttributes<HTMLElement> {
  translation: DictionaryType;
}
