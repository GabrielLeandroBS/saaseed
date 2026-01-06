import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/server/clients/resend";
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/server/utils/redis/rate-limit";
import { createApiError, toApiError, toError } from "@/server/utils/errors";
import { captureException } from "@/server/utils/sentry";
import { validateRequestBody } from "@/server/utils/validation-helper";
import { ResendEmailRequestSchema } from "@/models/schemas/api/resend.schema";
import { logError } from "@/server/utils/logger";
import { ErrorCode } from "@/models/enums/error-codes";
import { sanitizeText, sanitizeHtml } from "@/server/utils/sanitization";

/**
 * POST handler for Resend email endpoint
 *
 * Sends transactional emails via Resend API.
 * Validates and sanitizes email content before sending.
 * Applies strict rate limiting.
 *
 * @param request - Next.js request object containing email data
 * @returns NextResponse indicating email send status or error
 */
export async function handleResendEmail(
  request: NextRequest
): Promise<NextResponse> {
  const rateLimitResponse = await rateLimit(request, RATE_LIMIT_CONFIGS.STRICT);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Validate request body with Zod schema
    const validationResult = await validateRequestBody(
      ResendEmailRequestSchema,
      request
    );

    if (!validationResult.success) {
      return validationResult.response;
    }

    const { to, subject, html, from } = validationResult.data;

    // Sanitize validated data
    const sanitizedTo = sanitizeText(to, 100) || to;
    const sanitizedSubject = sanitizeText(subject, 200) || subject;
    const sanitizedHtml = sanitizeHtml(html) || html;
    const sanitizedFrom = from
      ? sanitizeText(from, 100) || from
      : "onboarding@resend.dev";

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: sanitizedFrom,
      to: sanitizedTo,
      subject: sanitizedSubject,
      html: sanitizedHtml,
    });

    if (error) {
      return createApiError(ErrorCode.VALIDATION_ERROR, error.message);
    }

    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (error) {
    const errorObj = toError(error);
    const apiError = toApiError(error);

    // Capture error to Sentry with context
    captureException(error, {
      tags: {
        route: "/api/resend",
        method: "POST",
        errorCode: apiError.code,
      },
      extra: {
        message: errorObj.message,
        stack: errorObj.stack,
      },
      request,
    });

    logError(error, {
      context: "resend-api",
      route: "/api/resend",
      method: "POST",
    });

    return createApiError(apiError.code, apiError.message);
  }
}
