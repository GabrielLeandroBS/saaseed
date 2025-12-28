import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/container/forms/auth/forgot-password";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

export async function generateMetadata({
  params,
}: ParamsProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.authentication.titleForgotPassword,
    description:
      dict.authentication.subtitleForgotPassword || siteConfig.description,
  };
}

export default async function ForgotPasswordPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <ForgotPasswordForm translation={dict} />;
}
