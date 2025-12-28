import type { Metadata } from "next";

import { DateRangePicker } from "@/components/container/generic/calendar";
import { SubscriptionsCard } from "@/components/container/generic/card/subscriptions";
import { Members } from "@/components/container/generic/members";
import { Text } from "@/components/ui/text";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/get/dictionaries";
import { getSubscriptionsCardMock } from "@/models/mocks/dashboard-cards";
import { getMembersMock } from "@/models/mocks/members";

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

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Members members={getMembersMock()} translation={dict} />

        <SubscriptionsCard
          data={getSubscriptionsCardMock()}
          translation={dict}
        />
      </section>
    </div>
  );
}
