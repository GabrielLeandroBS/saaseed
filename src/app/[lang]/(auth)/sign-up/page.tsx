import type { Metadata } from "next";

import { SignUpForm } from "@/components/container/forms/auth/sign-up";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

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

export default async function SignUpPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <SignUpForm translation={dict} lang={lang} />;
}
