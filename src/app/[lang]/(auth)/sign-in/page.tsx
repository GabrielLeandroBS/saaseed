import type { Metadata } from "next";

import { AuthForm } from "@/components/containers/forms/auth/auth-form";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/i18n/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

/**
 * Generates metadata for sign-in page
 *
 * @param params - Route parameters containing language
 * @returns Promise resolving to Next.js Metadata object
 */
export async function generateMetadata({
  params,
}: ParamsProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.authentication.titleSignIn,
    description: dict.authentication.subtitleSignIn || siteConfig.description,
  };
}

/**
 * Sign-in page component
 *
 * Displays authentication form for user sign-in.
 * Supports internationalization with translations.
 *
 * @param params - Route parameters containing language
 * @returns Promise resolving to sign-in page JSX
 */
export default async function SignInPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <AuthForm mode="sign-in" translation={dict} lang={lang} />;
}
