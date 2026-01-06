import type { Metadata } from "next";

import { DateRangePicker } from "@/components/dynamics/date-range-picker";
import { PaymentRequiredModal } from "@/components/features/payment-required-modal";
import { Text } from "@/components/ui/text";
import { TrialInfo } from "@/components/features/trial-info";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/i18n/dictionaries";

import { ParamsProps } from "@/models/interfaces/components/params";

/**
 * Generates metadata for the dashboard page
 *
 * @param params - Route parameters containing language
 * @returns Promise resolving to Next.js Metadata object
 */
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

/**
 * Dashboard page component
 *
 * Main dashboard page displaying trial info and date range picker.
 * Includes payment required modal for handling subscription payments.
 *
 * @param params - Route parameters containing language
 * @returns Promise resolving to dashboard page JSX
 */
export default async function DashboardPage({ params }: ParamsProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <PaymentRequiredModal translation={dict.dashboard} />
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
            <DateRangePicker
              locale={lang}
              translations={dict.generic.calendar}
            />
          </div>
        </section>

        <section>
          <TrialInfo translation={dict.dashboard} />
        </section>
      </div>
    </>
  );
}
