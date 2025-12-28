import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env";
import { resend } from "@/server/resend";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
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
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">Magic Link</h1>
                  </div>
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; margin-bottom: 20px;">Click the button below to sign in to your account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${url}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Sign In</a>
                    </div>
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">Or copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; color: #999; word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">${url}</p>
                    <p style="font-size: 12px; color: #999; margin-top: 30px;">This link will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
                  </div>
                </body>
              </html>
            `,
          });

          if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send magic link email");
          }
        } catch (error) {
          console.error("Error sending magic link:", error);
          throw error;
        }
      },
    }),
  ],
});
