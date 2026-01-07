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

/**
 * Props for check-email page with email search param
 */
export interface CheckEmailPageProps {
  params: Promise<{ lang: LocaleType }>;
  searchParams: Promise<{ email?: string }>;
}
