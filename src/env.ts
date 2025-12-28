import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z
      .string({
        message: "BETTER_AUTH_SECRET is required and must be a string",
      })
      .min(16, "BETTER_AUTH_SECRET must be at least 16 characters long"),
    BETTER_AUTH_URL: z
      .string({ message: "BETTER_AUTH_URL is required and must be a string" })
      .url(
        "BETTER_AUTH_URL must be a valid URL (e.g., https://your-domain.com)",
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
        "NEXT_PUBLIC_API_URL must be a valid URL (e.g., https://api.your-domain.com)",
      ),
    NEXT_PUBLIC_SUPABASE_URL: z
      .string({
        message: "NEXT_PUBLIC_SUPABASE_URL is required and must be a string",
      })
      .url(
        "NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL (e.g., https://your-project.supabase.co)",
      ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
      .string({
        message:
          "NEXT_PUBLIC_SUPABASE_ANON_KEY is required and must be a string",
      })
      .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty"),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
