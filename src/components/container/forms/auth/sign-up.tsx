"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { Text } from "@/components/ui/text";

import { signIn } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";
import { AuthProps } from "@/models/interfaces/components/forms/auth";
import { AuthSignUpSchema, AuthSignUpSchemaType } from "@/models/schemas/auth";

export function SignUpForm({ className, translation, ...props }: AuthProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof AuthSignUpSchema>>({
    resolver: zodResolver(AuthSignUpSchema),
    defaultValues: {
      email: "",
      name: "",
      surname: "",
    },
  });

  const onSubmit: SubmitHandler<AuthSignUpSchemaType> = async (data) => {
    const validatedCredentials = AuthSignUpSchema.parse(data);

    if (!validatedCredentials) {
      return;
    }

    setLoading(true);

    const signUpPromise = signIn
      .magicLink({
        email: validatedCredentials.email,
        name: `${validatedCredentials.name} ${validatedCredentials.surname}`,
        callbackURL: `/${FrontendRoutesEnum.DASHBOARD}`,
      })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error.message || "Failed to send magic link");
        }
        return result;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });

    toast.promise(signUpPromise, {
      loading: translation?.generic.loading,
      success: () => {
        return (
          translation?.success.userCreated ||
          "Magic link sent! Check your email."
        );
      },
      error: (error: Error | string) => {
        const errorMessage = typeof error === "string" ? error : error.message;
        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("user")
        ) {
          return translation?.errors.userAlreadyExists;
        }
        return translation?.errors.failedRequest;
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {translation?.authentication.titleSignUp}
          </CardTitle>

          <CardDescription>
            {translation?.authentication.subtitleSignUp}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation?.authentication.name}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translation.placeholder.name}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation?.authentication.surname}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translation.placeholder.surname}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation?.authentication.email}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translation.placeholder.email}
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

              <Text as="div" size="sm" align="center">
                {translation?.authentication.haveAccount}{" "}
                <Link
                  href={`/${FrontendRoutesEnum.SIGN_IN}`}
                  className="underline underline-offset-4"
                >
                  {translation?.authentication.signIn}
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
        {translation?.authentication.acceptTerms}
      </Text>
    </div>
  );
}

SignUpForm.displayName = "SignUpForm";
