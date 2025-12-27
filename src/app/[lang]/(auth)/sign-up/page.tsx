import { SignUpForm } from "@/components/container/forms/auth/sign-up";

import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

export default async function SignUpPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <SignUpForm translation={dict} />;
}
