import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/server/clients/stripe";
import { env } from "@/env";
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/server/utils/redis/rate-limit";
import { createApiError, toApiError } from "@/server/utils/errors";
import { captureException } from "@/server/utils/sentry";
import { logError, logDebug } from "@/server/utils/logger";
import { ErrorCode } from "@/models/enums/error-codes";
import {
  handleSubscriptionUpdated,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handleSubscriptionDeleted,
  handleSubscriptionTrialWillEnd,
} from "@/services/payment/webhooks";

/**
 * POST handler for Stripe webhook events
 *
 * Processes webhook events from Stripe (subscription updates, invoices, etc.).
 * Verifies webhook signature and routes events to appropriate handlers.
 * Applies relaxed rate limiting for webhook reliability.
 *
 * @param req - Next.js request object containing webhook payload and signature
 * @returns NextResponse indicating webhook processing status
 */
export async function handleStripeWebhook(
  req: NextRequest
): Promise<NextResponse> {
  const rateLimitResponse = await rateLimit(req, RATE_LIMIT_CONFIGS.RELAXED);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    logError(new Error("Missing stripe-signature header"), {
      context: "webhook",
    });
    return createApiError(ErrorCode.VALIDATION_ERROR, "Missing signature");
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    logError(new Error("STRIPE_WEBHOOK_SECRET not configured"), {
      context: "webhook",
    });
    return createApiError(
      ErrorCode.INTERNAL_ERROR,
      "Webhook secret not configured"
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    logError(error, { context: "webhook", action: "signatureVerification" });
    return createApiError(
      ErrorCode.VALIDATION_ERROR,
      "Webhook signature verification failed"
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionTrialWillEnd(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        logDebug(`Unhandled event type: ${event.type}`, { context: "webhook" });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const apiError = toApiError(error);

    captureException(error, {
      tags: {
        route: "/api/webhooks/stripe",
        method: "POST",
        errorCode: apiError.code,
        eventType: event?.type || "unknown",
      },
      request: req,
    });

    logError(error, {
      context: "webhook",
      action: "processWebhook",
      eventType: event?.type,
    });

    return createApiError(apiError.code, apiError.message);
  }
}
