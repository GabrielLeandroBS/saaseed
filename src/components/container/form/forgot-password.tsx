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
  AuthForgotPasswordSchema,
  AuthForgotPasswordSchemaType,
} from "@/models/schemas/auth";
import { ForgotPasswordService } from "@/services/entities/auth";

export function ForgotPasswordForm({
  className,
  translation,
  ...props
}: AuthProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof AuthForgotPasswordSchema>>({
    resolver: zodResolver(AuthForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<AuthForgotPasswordSchemaType> = (data) => {
    const validatedData = AuthForgotPasswordSchema.parse(data);

    if (!validatedData) {
      return;
    }

    setLoading(true);

    const forgoPasswordPromise = new Promise((resolve, reject) => {
      ForgotPasswordService({
        email: data.email,
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

    toast.promise(forgoPasswordPromise, {
      loading: translation?.generic.loading,
      success: () => {
        return translation?.success.forgotPasswordSuccess;
      },
      error: () => {
        return translation?.errors.forgotPasswordFailed;
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {translation?.authentication.titleForgotPassword}
          </CardTitle>

          <CardDescription>
            {translation?.authentication.subtitleForgotPassword}
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
                        placeholder={translation.placeholder.email}
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
        {translation?.authentication.forgotPasswordMessage}
      </div>
    </div>
  );
}
