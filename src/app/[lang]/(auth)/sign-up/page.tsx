import type { Metadata } from "next";

import { AuthForm } from "@/components/containers/forms/auth/auth-form";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/i18n/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

/**
 * Generates metadata for sign-up page
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
    title: dict.authentication.titleSignUp,
    description: dict.authentication.subtitleSignUp || siteConfig.description,
  };
}

/**
 * Sign-up page component
 *
 * Displays authentication form for user registration.
 * Supports internationalization with translations.
 *
 * @param params - Route parameters containing language
 * @returns Promise resolving to sign-up page JSX
 */
export default async function SignUpPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <AuthForm mode="sign-up" translation={dict} lang={lang} />;
}
