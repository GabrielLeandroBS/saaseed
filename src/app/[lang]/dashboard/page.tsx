import { DateRangePicker } from "@/components/container/generic/calendar";
import { Text } from "@/components/ui/text";

import { getDictionary } from "@/lib/get/dictionaries";
import { requireAuth } from "@/server/actions";

import { ParamsProps } from "@/models/interfaces/components/params";

export default async function DashboardPage({ params }: ParamsProps) {
  const { lang } = await params;

  // Require authentication - redirects to sign-in if not authenticated
  await requireAuth();

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
