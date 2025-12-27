"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";

import { signIn } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";
import { AuthProps } from "@/models/interfaces/components/forms/auth";
import { AuthSignInSchema, AuthSignInSchemaType } from "@/models/schemas/auth";

export function SignInForm({
  className,
  translation,
  lang = "pt",
  ...props
}: AuthProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const form = useForm<z.infer<typeof AuthSignInSchema>>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AuthSignInSchemaType> = async (data) => {
    const validatedCredentials = AuthSignInSchema.parse(data);

    if (!validatedCredentials) {
      return;
    }

    setLoading(true);

    const signInPromise = signIn
      .email({
        email: data.email,
        password: data.password,
      })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error.message || "Sign-in failed");
        }
        return result;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(signInPromise, {
      loading: translation?.generic.loading,
      success: () => {
        router.push(`/${lang}${FrontendRoutesEnum.DASHBOARD}`);
        return translation?.success.signInSuccess;
      },
      error: (error: Error | string) => {
        const errorMessage = typeof error === "string" ? error : error.message;
        if (
          errorMessage === "Sign-in failed" ||
          errorMessage.includes("Invalid")
        ) {
          return translation?.errors.signInFailed;
        }

        return translation?.errors.failedRequest;
      },
    });
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: `/${lang}${FrontendRoutesEnum.DASHBOARD}`,
      });
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : translation?.errors.failedRequest ||
              "Failed to sign in with Google",
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {translation?.authentication.signIn}
          </CardTitle>
          <CardDescription>
            {translation?.authentication.subtitleSignIn}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation?.authentication.email}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translation?.placeholder.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <section className="flex items-center justify-between">
                      <FormLabel>
                        {translation?.authentication.password}
                      </FormLabel>
                      <Link href={FrontendRoutesEnum.FORGOT_PASSWORD}>
                        <FormDescription className="text-right">
                          {translation?.authentication.forgotPassword}
                        </FormDescription>
                      </Link>
                    </section>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={translation?.placeholder.password}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  translation?.authentication.submit
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center">
                  <Text
                    as="span"
                    size="xs"
                    color="muted"
                    className="bg-card px-2 uppercase"
                  >
                    {translation?.authentication.or}
                  </Text>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <svg
                      className="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {translation?.authentication.signInWithGoogle}
                  </>
                )}
              </Button>

              <Text as="div" size="sm" align="center">
                {translation?.authentication.dontHaveAccount}{" "}
                <Link
                  href={FrontendRoutesEnum.SIGN_UP}
                  className="underline underline-offset-4"
                >
                  {translation?.authentication.createAccount}
                </Link>
              </Text>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Text
        as="div"
        size="xs"
        color="muted"
        align="center"
        className="*:[a]:hover:text-primary text-balance *:[a]:underline *:[a]:underline-offset-4"
      >
        {translation?.authentication.welcomeMessage}
      </Text>
    </div>
  );
}
