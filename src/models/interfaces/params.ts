import { LocaleType } from "@/models/types/locale";

export interface ParamsProps {
  params: Promise<{ lang: LocaleType; token?: string }>;
}
