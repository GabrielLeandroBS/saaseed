import { Rocket } from "lucide-react";

import { Text } from "@/components/ui/text";

import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
} & ParamsProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full items-center justify-center max-w-sm flex-col gap-6">
        <div className="bg-card border border-border flex size-16 items-center justify-center rounded-md">
          <Rocket className="size-6" />
        </div>

        <Text as="h1" size="2xl" className="text-center">
          {dict.authentication.welcomeTitle}
        </Text>

        {children}
      </div>
    </div>
  );
}
