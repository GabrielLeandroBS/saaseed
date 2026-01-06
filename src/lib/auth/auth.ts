import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { env } from "@/env";
import { resend } from "@/server/clients/resend";
import { syncUserAfterAuth } from "@/services/auth/sync";
import { getMagicLinkEmailTemplate } from "@/models/emails/magic-link";
import { logError } from "@/server/utils/logger";

/**
 * Better Auth configuration
 *
 * This is the main authentication instance used throughout the application.
 * It's configured in stateless mode (no database), storing sessions in encrypted cookies.
 *
 * Features:
 * - Magic link authentication (passwordless)
 * - Google OAuth
 * - Automatic user sync to Supabase and Stripe after authentication
 *
 * The `after` hook automatically syncs users to:
 * - Supabase Auth (for user management and RLS)
 * - Stripe (for payment processing)
 * - Creates trial subscription with 14-day free trial
 */
export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
      strategy: "jwe",
      refreshCache: true,
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  hooks: {
    /**
     * After hook: Runs after successful authentication operations
     *
     * Automatically syncs user to:
     * - Supabase Auth (creates/updates user in auth.users)
     * - Stripe (creates/updates customer and subscription)
     *
     * Only runs for authentication operations (sign-in, sign-up, magic-link, OAuth)
     */
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;
      if (!newSession?.user) return;

      const isAuthOperation =
        ctx.path.includes("/sign-in") ||
        ctx.path.includes("/sign-up") ||
        ctx.path.includes("/callback") ||
        ctx.path.includes("/magic-link") ||
        ctx.path.includes("/verify") ||
        ctx.path.includes("/social");

      if (!isAuthOperation) return;

      await syncUserAfterAuth({
        userId: newSession.user.id,
        email: newSession.user.email ?? "",
        name: newSession.user.name,
        image: newSession.user.image,
      });
    }),
  },
  plugins: [
    nextCookies(),
    magicLink({
      async sendMagicLink({ email, url }) {
        try {
          const { error } = await resend.emails.send({
            from: env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: email,
            subject: "Sign in to your account",
            html: getMagicLinkEmailTemplate(url),
          });

          if (error) {
            logError(error, {
              context: "magic-link",
              service: "resend",
              action: "send-email",
            });
            throw new Error("Failed to send magic link email");
          }
        } catch (error) {
          logError(error, {
            context: "magic-link",
            service: "resend",
            action: "send-email",
          });
          throw error;
        }
      },
    }),
  ],
});
