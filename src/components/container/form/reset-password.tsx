"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

import { cn } from "@/lib/utils";

import { AuthProps } from "@/models/interfaces/auth";

import {
  AuthResetPasswordSchema,
  AuthResetPasswordSchemaType,
} from "@/models/schemas/auth";
import { ResetPasswordService } from "@/services/entities/auth";

export function ResetPasswordForm({
  className,
  translation,
  token,
  ...props
}: AuthProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof AuthResetPasswordSchema>>({
    resolver: zodResolver(AuthResetPasswordSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AuthResetPasswordSchemaType> = (data) => {
    const validatedData = AuthResetPasswordSchema.parse(data);

    if (!validatedData) {
      return;
    }

    console.log(token);

    setLoading(true);

    const resetPasswordPromise = new Promise((resolve, reject) => {
      ResetPasswordService({
        password: data.password,
        token: token || "",
      })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });

    toast.promise(resetPasswordPromise, {
      loading: translation?.generic.loading,
      success: () => {
        return translation?.success.resetPasswordSuccess;
      },
      error: () => {
        return translation?.errors.resetPasswordFailed;
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {translation?.authentication.titleResetPassword}
          </CardTitle>

          <CardDescription>
            {translation?.authentication.subtitleResetPassword}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translation?.authentication.password}
                    </FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {translation?.authentication.confirmPassword}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={translation.placeholder.confirmPassword}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  translation?.authentication.submit
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {translation?.authentication.resetPasswordMessage}
      </div>
    </div>
  );
}
