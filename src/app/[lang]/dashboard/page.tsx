import type { Metadata } from "next";

import { DateRangePicker } from "@/components/container/generic/calendar";
import { Text } from "@/components/ui/text";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/get/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

export async function generateMetadata({
  params,
}: ParamsProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.dashboard.title,
    description: siteConfig.description,
  };
}

export default async function DashboardPage({ params }: ParamsProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex items-center justify-between w-full">
        <Text
          as="h1"
          size="xl"
          weight="medium"
          tracking="tight"
          className="lg:text-2xl"
        >
          {dict.dashboard.title}
        </Text>

        <div className="flex items-center gap-2">
          <DateRangePicker locale={lang} translations={dict.generic.calendar} />
        </div>
      </section>
    </div>
  );
}
