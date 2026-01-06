import Link from "next/link";
import { cookies } from "next/headers";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { LocaleType } from "@/models/types/locale";

/**
 * Not Found page component
 *
 * Displays a 404 error page with a message and a link to the home page.
 * Supports internationalization with translations.
 *
 * @returns JSX element for not found page
 */
export default async function NotFound() {
  const cookieLang = (await cookies()).get("NEXT_LOCALE");
  const lang = (cookieLang?.value || "en") as LocaleType;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen p-4">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Text as="h1" size="2xl" weight="bold" className="text-foreground">
          {dict.common.notFound.title}
        </Text>

        <Text
          as="p"
          size="base"
          className="text-muted-foreground text-center max-w-md"
        >
          {dict.common.notFound.description}
        </Text>
      </div>
      <Button asChild variant="default">
        <Link href={`/${lang}`}>{dict.common.notFound.returnHome}</Link>
      </Button>
    </div>
  );
}
