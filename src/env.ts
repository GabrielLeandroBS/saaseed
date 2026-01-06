import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variables configuration
 *
 * Validates and exports all environment variables with Zod schemas.
 * Ensures required variables are present and properly formatted at build time.
 * Separates server-side and client-side environment variables.
 */
export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z
      .string({
        message: "BETTER_AUTH_SECRET is required and must be a string",
      })
      .min(32, "BETTER_AUTH_SECRET must be at least 32 characters long")
      .regex(/^[A-Za-z0-9+/=]+$/, "BETTER_AUTH_SECRET must be base64 encoded"),
    BETTER_AUTH_URL: z
      .string({ message: "BETTER_AUTH_URL is required and must be a string" })
      .url(
        "BETTER_AUTH_URL must be a valid URL (e.g., https://your-domain.com)"
      ),
    GOOGLE_CLIENT_ID: z
      .string({ message: "GOOGLE_CLIENT_ID is required and must be a string" })
      .min(1, "GOOGLE_CLIENT_ID cannot be empty"),
    GOOGLE_CLIENT_SECRET: z
      .string({
        message: "GOOGLE_CLIENT_SECRET is required and must be a string",
      })
      .min(1, "GOOGLE_CLIENT_SECRET cannot be empty"),
    RESEND_API_KEY: z
      .string({ message: "RESEND_API_KEY is required and must be a string" })
      .min(1, "RESEND_API_KEY cannot be empty"),
    RESEND_FROM_EMAIL: z
      .string({ message: "RESEND_FROM_EMAIL must be a string" })
      .email("RESEND_FROM_EMAIL must be a valid email address")
      .optional(),
    SUPABASE_SERVICE_ROLE_KEY: z
      .string({
        message: "SUPABASE_SERVICE_ROLE_KEY is required for user management",
      })
      .min(1, "SUPABASE_SERVICE_ROLE_KEY cannot be empty")
      .optional(),
    STRIPE_SECRET_KEY: z
      .string({
        message: "STRIPE_SECRET_KEY is required",
      })
      .min(1, "STRIPE_SECRET_KEY cannot be empty"),
    STRIPE_DEFAULT_PRICE_ID: z
      .string({
        message: "STRIPE_DEFAULT_PRICE_ID is required for trial subscriptions",
      })
      .min(1, "STRIPE_DEFAULT_PRICE_ID cannot be empty"),
    STRIPE_WEBHOOK_SECRET: z
      .string({
        message: "STRIPE_WEBHOOK_SECRET is required for webhook verification",
      })
      .min(1, "STRIPE_WEBHOOK_SECRET cannot be empty")
      .optional(),
    UPSTASH_REDIS_REST_URL: z
      .string({
        message: "UPSTASH_REDIS_REST_URL is required for Redis cache",
      })
      .url("UPSTASH_REDIS_REST_URL must be a valid URL"),
    UPSTASH_REDIS_REST_TOKEN: z
      .string({
        message: "UPSTASH_REDIS_REST_TOKEN is required for Redis cache",
      })
      .min(1, "UPSTASH_REDIS_REST_TOKEN cannot be empty"),
    NODE_ENV: z
      .enum(["development", "test", "production"], {
        message:
          "NODE_ENV must be one of: 'development', 'test', or 'production'",
      })
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_API_URL: z
      .string({
        message: "NEXT_PUBLIC_API_URL is required and must be a string",
      })
      .url(
        "NEXT_PUBLIC_API_URL must be a valid URL (e.g., https://api.your-domain.com)"
      ),
    NEXT_PUBLIC_SUPABASE_URL: z
      .string({
        message: "NEXT_PUBLIC_SUPABASE_URL is required and must be a string",
      })
      .url(
        "NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL (e.g., https://your-project.supabase.co)"
      ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
      .string({
        message:
          "NEXT_PUBLIC_SUPABASE_ANON_KEY is required and must be a string",
      })
      .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty"),
    NEXT_PUBLIC_SENTRY_DSN: z
      .string({
        message: "NEXT_PUBLIC_SENTRY_DSN must be a string",
      })
      .url("NEXT_PUBLIC_SENTRY_DSN must be a valid URL")
      .optional(),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z
      .string({
        message: "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION must be a string",
      })
      .optional(),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_DEFAULT_PRICE_ID: process.env.STRIPE_DEFAULT_PRICE_ID,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
});
