import { Resend } from "resend";
import { env } from "@/env";

/**
 * Resend client for sending transactional emails
 *
 * Used for:
 * - Magic link authentication emails
 * - Password reset emails
 * - Transactional notifications
 *
 * ⚠️ IMPORTANT: Only use this on the server-side!
 */
export const resend = new Resend(env.RESEND_API_KEY);
