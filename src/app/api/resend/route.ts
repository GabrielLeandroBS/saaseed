import { NextRequest } from "next/server";
import { handleResendEmail } from "@/server/routes/resend/handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * POST handler for Resend email API route
 *
 * Sends transactional emails via Resend API.
 * Used for magic links, password resets, and notifications.
 * Configured with 10 second max duration.
 *
 * @param request - Next.js request object
 * @returns Response indicating email send status
 */
export async function POST(request: NextRequest) {
  return handleResendEmail(request);
}
