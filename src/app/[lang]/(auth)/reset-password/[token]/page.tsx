import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/container/forms/auth/reset-password";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

export async function generateMetadata({
  params,
}: ParamsProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.authentication.titleResetPassword,
    description:
      dict.authentication.subtitleResetPassword || siteConfig.description,
  };
}

export default async function ResetPasswordPage({ params }: ParamsProps) {
  const { lang, token } = await params;

  const dict = await getDictionary(lang);

  return <ResetPasswordForm token={token} translation={dict} />;
}
