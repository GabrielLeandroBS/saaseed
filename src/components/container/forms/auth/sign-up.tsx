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

import { cn } from "@/lib/utils";
import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";
import { AuthProps } from "@/models/interfaces/components/forms/auth";
import { AuthSignUpSchema, AuthSignUpSchemaType } from "@/models/schemas/auth";
import { SignUpService } from "@/services/entities/auth";

export function SignUpForm({ className, translation, ...props }: AuthProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof AuthSignUpSchema>>({
    resolver: zodResolver(AuthSignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      surname: "",
    },
  });

  const onSubmit: SubmitHandler<AuthSignUpSchemaType> = async (data) => {
    const validatedCredentials = AuthSignUpSchema.parse(data);

    if (!validatedCredentials) {
      return;
    }

    const { email, password, name, surname } = validatedCredentials;

    setLoading(true);

    const signUpPromise = new Promise((resolve, reject) => {
      SignUpService({ email, password, name, surname })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    });

    toast.promise(signUpPromise, {
      loading: translation?.generic.loading,
      success: () => {
        return translation?.success.userCreated;
      },
      error: () => {
        return translation?.errors.userAlreadyExists;
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <section className="flex items-center justify-between">
                      <FormLabel>
                        {translation?.authentication.password}
                      </FormLabel>
                    </section>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={translation.placeholder.password}
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
                  href={FrontendRoutesEnum.SIGN_IN}
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
