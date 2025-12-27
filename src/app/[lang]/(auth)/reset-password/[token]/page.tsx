import { ResetPasswordForm } from "@/components/container/forms/auth/reset-password";

import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

export default async function ResetPasswordPage({ params }: ParamsProps) {
  const { lang, token } = await params;

  const dict = await getDictionary(lang);

  return <ResetPasswordForm token={token} translation={dict} />;
}
