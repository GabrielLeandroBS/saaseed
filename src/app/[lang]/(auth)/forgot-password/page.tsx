import { ForgotPasswordForm } from "@/components/container/forms/auth/forgot-password";

import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

export default async function ForgotPasswordPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <ForgotPasswordForm translation={dict} />;
}
