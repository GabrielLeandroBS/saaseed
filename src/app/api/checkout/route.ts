import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/server/clients/stripe";
import { supabaseAdmin } from "@/server/clients/supabase";
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/server/utils/redis/rate-limit";
import { requireApiSession } from "@/server/routes/auth/helpers";
import { createApiError, toApiError } from "@/server/utils/errors";
import { captureException } from "@/server/utils/sentry";
import { logError } from "@/server/utils/logger";
import { ErrorCode } from "@/models/enums/error-codes";
import { env } from "@/env";

/**
 * POST handler for creating Stripe Checkout Session
 *
 * Creates a checkout session to pay for a pending invoice.
 * Used when subscription status is "past_due" or trial expired without payment.
 * Requires authentication and applies rate limiting.
 *
 * @param request - Next.js request object
 * @returns NextResponse with checkout URL or error
 */
export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimit(
    request,
    RATE_LIMIT_CONFIGS.MODERATE
  );
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await requireApiSession();

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error || !data) {
      return createApiError(
        ErrorCode.SUPABASE_ERROR,
        "Failed to fetch user data"
      );
    }

    const supabaseUser = data.users.find(
      (u) => u.user_metadata?.betterAuthUserId === session.user.id
    );

    if (!supabaseUser) {
      return createApiError(ErrorCode.NOT_FOUND, "User not found");
    }

    const customerId = supabaseUser.user_metadata?.stripeCustomerId as
      | string
      | undefined;

    if (!customerId) {
      return createApiError(ErrorCode.NOT_FOUND, "No Stripe customer found");
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: "all",
      expand: ["data.latest_invoice"],
    });

    if (subscriptions.data.length === 0) {
      return createApiError(ErrorCode.NOT_FOUND, "No subscription found");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.BETTER_AUTH_URL}/dashboard`,
    });

    return NextResponse.json({
      checkoutUrl: portalSession.url,
    });
  } catch (error) {
    const apiError = toApiError(error);

    captureException(error, {
      tags: {
        route: "/api/checkout",
        method: "POST",
        errorCode: apiError.code,
      },
      request,
    });

    logError(error, { context: "checkout-api", route: "/api/checkout" });

    return createApiError(apiError.code, apiError.message);
  }
}
