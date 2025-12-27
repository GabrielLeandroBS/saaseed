import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env";

/**
 * Better Auth instance configuration (stateless mode)
 *
 * Using stateless session management - no database required
 *
 * @see https://better-auth.com/docs/getting-started
 */
export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [nextCookies()], // Automatically sets cookies in server actions
});
