import { SignUpForm } from "@/components/container/form/sign-up";

import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/params";

export default async function SignUpPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <SignUpForm translation={dict} />;
}
