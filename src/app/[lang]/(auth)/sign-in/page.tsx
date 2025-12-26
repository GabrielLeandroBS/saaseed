import { SignInForm } from "@/components/container/form/sign-in";

import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/params";

export default async function SignInPage({ params }: ParamsProps) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <SignInForm translation={dict} lang={lang} />;
}
