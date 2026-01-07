import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/i18n/dictionaries";

import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";
import type { CheckEmailPageProps } from "@/models/interfaces/components/params";

/**
 * Generates metadata for check-email page
 *
 * @param params - Route parameters containing language
 * @returns Promise resolving to Next.js Metadata object
 */
export async function generateMetadata({
  params,
}: CheckEmailPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.authentication.checkEmailTitle,
    description:
      dict.authentication.checkEmailDescription || siteConfig.description,
  };
}

/**
 * Check email page component
 *
 * Displays success message after sending magic link.
 * Shows the email address and instructions to check inbox.
 *
 * @param params - Route parameters containing language
 * @param searchParams - URL search parameters containing email
 * @returns Promise resolving to check-email page JSX
 */
export default async function CheckEmailPage({
  params,
  searchParams,
}: CheckEmailPageProps) {
  const { lang } = await params;
  const { email } = await searchParams;

  const dict = await getDictionary(lang);

  // Email already comes masked from the auth form (e.g., gab***@gmail.com)
  const maskedEmail = email || null;

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-sm">
      <div className="relative">
        <div className="bg-card border border-border flex size-16 items-center justify-center rounded-md">
          <Mail className="size-6 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5">
          <Sparkles className="size-2" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Text as="h1" size="2xl" weight="semibold">
          {dict.authentication.checkEmailTitle}
        </Text>

        {maskedEmail && (
          <Text as="p" size="base" className="text-muted-foreground">
            {dict.authentication.checkEmailSubtitle}{" "}
            <span className="font-medium text-foreground">{maskedEmail}</span>
          </Text>
        )}

        <Text as="p" size="sm" className="text-muted-foreground">
          {dict.authentication.checkEmailDescription}
        </Text>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <Text as="p" size="sm" className="text-muted-foreground">
            <span className="font-medium text-foreground">
              {dict.authentication.checkEmailNotReceived}
            </span>{" "}
            {dict.authentication.checkEmailSpam}
          </Text>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link href={`/${FrontendRoutesEnum.SIGN_IN}`}>
            <ArrowLeft className="size-4" />
            <Text as="span" size="sm">
              {dict.authentication.backToSignIn}
            </Text>
          </Link>
        </Button>
      </div>
    </div>
  );
}
