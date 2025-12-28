import type { Metadata } from "next";

import { SignInForm } from "@/components/container/forms/auth/sign-in";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

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

export default async function SignInPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <SignInForm translation={dict} lang={lang} />;
}
