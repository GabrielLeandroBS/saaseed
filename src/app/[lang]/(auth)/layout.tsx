import { Rocket } from "lucide-react";

import { Text } from "@/components/ui/text";

import { getDictionary } from "@/lib/i18n/dictionaries";

import { LocaleType } from "@/models/types/locale";
import type { AuthLayoutProps } from "@/models/interfaces/layout/auth-layout";

/**
 * Authentication layout component
 *
 * Provides layout for authentication pages (sign-in, sign-up).
 * Displays welcome title and logo, loads translations.
 *
 * @param children - Authentication page content
 * @param params - Route parameters containing language
 * @returns Promise resolving to auth layout JSX
 */
export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { lang } = await params;
  const locale = lang as LocaleType;
  const dict = await getDictionary(locale);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full items-center justify-center max-w-sm flex-col gap-6">
        <div className="bg-card border border-border flex size-16 items-center justify-center rounded-md">
          <Rocket className="size-6" />
        </div>

        <Text as="h1" size="2xl" className="text-center">
          {dict.authentication.welcomeTitle}
        </Text>

        {children}
      </div>
    </div>
  );
}
