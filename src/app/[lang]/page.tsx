import { Text } from "@/components/ui/text";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LocaleType } from "@/models/types/locale";
import { cookies } from "next/headers";
/**
 * Home page component
 *
 * Main landing page for the application.
 *
 * @returns JSX element for home page
 */
export default async function Home() {
  const cookieLang = (await cookies()).get("NEXT_LOCALE");
  const lang = (cookieLang?.value || "en") as LocaleType;
  const dict = await getDictionary(lang);

  return (
    <Text as="h1" size="2xl" className="text-center">
      {dict.authentication.welcomeTitle}
    </Text>
  );
}
