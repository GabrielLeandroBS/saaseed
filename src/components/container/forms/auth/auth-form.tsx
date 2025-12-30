"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LoadingSpinner } from "@/components/ui/loading";
import { Text } from "@/components/ui/text";

import { signIn } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";
import { type AuthFormProps } from "@/models/interfaces/components/forms/auth-form";
import { AuthSignInSchema, AuthSignInSchemaType } from "@/models/schemas/auth";

export function AuthForm({
  mode,
  className,
  translation,
  ...props
}: AuthFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const isSignUp = mode === "sign-up";

  // Both schemas are the same now (only email)
  const form = useForm<AuthSignInSchemaType>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<AuthSignInSchemaType> = async (data) => {
    const validatedCredentials = AuthSignInSchema.parse(data);

    if (!validatedCredentials) {
      return;
    }

    setLoading(true);

    const authPromise = signIn
      .magicLink({
        email: validatedCredentials.email,
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

    toast.promise(authPromise, {
      loading: translation?.generic.loading,
      success: () => {
        return isSignUp
          ? translation?.success.userCreated ||
              "Magic link sent! Check your email."
          : translation?.success.signInSuccess ||
              "Magic link sent! Check your email.";
      },
      error: (error: Error | string) => {
        const errorMessage = typeof error === "string" ? error : error.message;
        if (isSignUp) {
          if (
            errorMessage.includes("already exists") ||
            errorMessage.includes("user")
          ) {
            return translation?.errors.userAlreadyExists;
          }
        } else {
          if (
            errorMessage === "Failed to send magic link" ||
            errorMessage.includes("Invalid")
          ) {
            return translation?.errors.signInFailed;
          }
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
        callbackURL: `/${FrontendRoutesEnum.DASHBOARD}`,
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

  const alternateLink = isSignUp
    ? `/${FrontendRoutesEnum.SIGN_IN}`
    : `/${FrontendRoutesEnum.SIGN_UP}`;
  const alternateText = isSignUp
    ? translation?.authentication.haveAccount
    : translation?.authentication.dontHaveAccount;
  const alternateLinkText = isSignUp
    ? translation?.authentication.signIn
    : translation?.authentication.createAccount;
  const footerMessage = isSignUp
    ? translation?.authentication.acceptTerms
    : translation?.authentication.welcomeMessage;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.email}>
                    <FieldLabel htmlFor="auth-email">
                      <Text as="span" size="sm" weight="medium">
                        {translation?.authentication.email}
                      </Text>
                    </FieldLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <Mail className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="auth-email"
                          type="email"
                          placeholder={translation?.placeholder.email}
                          aria-invalid={!!form.formState.errors.email}
                          {...field}
                        />
                      </InputGroup>
                    </FormControl>
                    {form.formState.errors.email && (
                      <FieldError errors={[form.formState.errors.email]} />
                    )}
                  </Field>
                )}
              />

              <Field orientation="horizontal">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <Text as="span" size="sm" className="text-muted">
                      {isSignUp
                        ? translation?.authentication.submitSignUp
                        : translation?.authentication.submitSignIn}
                    </Text>
                  )}
                </Button>
              </Field>

              <FieldSeparator>
                <Text
                  as="span"
                  size="xs"
                  className="text-muted-foreground uppercase"
                >
                  {translation?.authentication.or}
                </Text>
              </FieldSeparator>

              <Field>
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
                      <Text as="span" size="sm">
                        {isSignUp
                          ? translation?.authentication.signUpWithGoogle
                          : translation?.authentication.signInWithGoogle}
                      </Text>
                    </>
                  )}
                </Button>
              </Field>

              <Field>
                <Text as="div" size="sm" align="center">
                  {alternateText}{" "}
                  <Link
                    href={alternateLink}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    {alternateLinkText}
                  </Link>
                </Text>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </Form>

      <Text
        as="div"
        size="xs"
        align="center"
        className="text-muted-foreground *:[a]:hover:text-primary text-balance *:[a]:underline *:[a]:underline-offset-4"
      >
        {footerMessage}
      </Text>
    </div>
  );
}

AuthForm.displayName = "AuthForm";
