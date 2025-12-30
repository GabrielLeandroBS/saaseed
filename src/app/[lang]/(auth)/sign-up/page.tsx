import type { Metadata } from "next";

import { AuthForm } from "@/components/container/forms/auth/auth-form";

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

  return <AuthForm mode="sign-up" translation={dict} lang={lang} />;
}
