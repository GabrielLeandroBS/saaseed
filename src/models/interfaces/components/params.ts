/**
 * Page params interfaces
 *
 * Interfaces for Next.js page component props with route parameters.
 */

import { LocaleType } from "@/models/types/locale";

/**
 * Props for pages with locale parameter
 */
export interface ParamsProps {
  params: Promise<{ lang: LocaleType; token?: string }>;
}
