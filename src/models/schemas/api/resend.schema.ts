/**
 * Resend Email API Schemas
 *
 * Zod schemas for validating Resend email API requests and responses.
 */

import { z } from "@/lib/zod";
import { XSS_PATTERNS } from "@/models/constants/validation";

/**
 * Safe HTML refinement - validates HTML content for XSS patterns
 */
const safeHtml = z
  .string()
  .refine((html) => !XSS_PATTERNS.some((pattern) => pattern.test(html)), {
    message: "HTML contains unsafe content",
  });

/**
 * Schema for Resend email request body
 */
export const ResendEmailRequestSchema = z.object({
  to: z.string().email("Invalid email"),
  subject: z.string().min(1).max(200),
  html: safeHtml,
  from: z.string().email().optional(),
});

/**
 * Schema for Resend email response
 */
export const ResendEmailResponseSchema = z.object({
  data: z.object({ id: z.string() }),
  success: z.literal(true),
});

/** Inferred type for Resend email request */
export type ResendEmailRequest = z.infer<typeof ResendEmailRequestSchema>;

/** Inferred type for Resend email response */
export type ResendEmailResponse = z.infer<typeof ResendEmailResponseSchema>;
