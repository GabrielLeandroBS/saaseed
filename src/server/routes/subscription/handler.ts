import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { supabaseAdmin } from "@/server/clients/supabase";
import { stripe } from "@/server/clients/stripe";
import { rateLimit, RATE_LIMIT_CONFIGS } from "@/server/utils/redis/rate-limit";
import { getApiSession } from "@/server/routes/auth/helpers";
import { createApiError, createError, toApiError } from "@/server/utils/errors";
import { captureException } from "@/server/utils/sentry";
import { logError } from "@/server/utils/logger";
import { SubscriptionStatus } from "@/models/enums/subscription-status";
import type { SubscriptionData } from "@/models/interfaces/services/payment";

/**
 * Retrieves subscription data for the current user
 *
 * Internal function used by the handler.
 * Fetches subscription data directly from Stripe without HTTP request.
 *
 * @returns Subscription data
 * @throws Error if user not found, no customer, or no subscription
 */
async function getSubscriptionData(): Promise<SubscriptionData> {
  const session = await getApiSession();

  if (!session) {
    throw createError("Authentication required");
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error || !data) {
    throw createError("Failed to fetch user data from Supabase");
  }

  const supabaseUser = data.users.find(
    (u) => u.user_metadata?.betterAuthUserId === session.user.id
  );

  if (!supabaseUser) {
    throw createError("User not found");
  }

  const customerId = supabaseUser.user_metadata?.stripeCustomerId as
    | string
    | undefined;

  if (!customerId) {
    throw createError("No Stripe customer found");
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    status: "all",
    expand: ["data.default_payment_method", "data.latest_invoice"],
  });

  if (subscriptions.data.length === 0) {
    throw createError("No subscription found");
  }

  const subscription = subscriptions.data[0];

  const getInvoiceId = (
    invoice: string | Stripe.Invoice | null | undefined
  ): string | null => {
    if (!invoice) return null;
    return typeof invoice === "string" ? invoice : invoice.id;
  };

  const invoiceId = getInvoiceId(subscription.latest_invoice);
  const latestInvoice = invoiceId
    ? await stripe.invoices.retrieve(invoiceId, {
        expand: ["payment_intent"],
      })
    : null;

  const getPaymentMethod = async (
    paymentMethod: string | Stripe.PaymentMethod | null | undefined
  ): Promise<Stripe.PaymentMethod | null> => {
    if (!paymentMethod) return null;

    const isExpanded = typeof paymentMethod !== "string";
    if (isExpanded) return paymentMethod;

    return stripe.paymentMethods.retrieve(paymentMethod);
  };

  const defaultPaymentMethod = await getPaymentMethod(
    subscription.default_payment_method
  );

  const convertUnixToISO = (
    timestamp: number | null | undefined
  ): string | null => {
    if (!timestamp || typeof timestamp !== "number") return null;
    return new Date(timestamp * 1000).toISOString();
  };

  const currentPeriodEnd = convertUnixToISO(
    ("current_period_end" in subscription &&
    typeof subscription.current_period_end === "number"
      ? subscription.current_period_end
      : null) as number | null | undefined
  );

  const currentPeriodStart = convertUnixToISO(
    ("current_period_start" in subscription &&
    typeof subscription.current_period_start === "number"
      ? subscription.current_period_start
      : null) as number | null | undefined
  );

  return {
    status: subscription.status as SubscriptionStatus,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
    trialStart: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    currentPeriodEnd,
    currentPeriodStart,
    cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    hasPaymentMethod: !!defaultPaymentMethod,
    paymentMethod: defaultPaymentMethod
      ? (() => {
          const isCard =
            defaultPaymentMethod.type === "card" && defaultPaymentMethod.card;

          if (!isCard || !defaultPaymentMethod.card) {
            return {
              type: defaultPaymentMethod.type,
              card: null,
            };
          }

          return {
            type: defaultPaymentMethod.type,
            card: {
              brand: defaultPaymentMethod.card.brand,
              last4: defaultPaymentMethod.card.last4,
              expMonth: defaultPaymentMethod.card.exp_month,
              expYear: defaultPaymentMethod.card.exp_year,
            },
          };
        })()
      : null,
    latestInvoice: latestInvoice
      ? {
          id: latestInvoice.id,
          amount: latestInvoice.amount_due,
          currency: latestInvoice.currency,
          status: latestInvoice.status || "open",
          paid: latestInvoice.status === "paid",
          dueDate: latestInvoice.due_date
            ? new Date(latestInvoice.due_date * 1000).toISOString()
            : null,
        }
      : null,
    subscriptionId: subscription.id,
    customerId: customerId,
  };
}

/**
 * GET handler for subscription endpoint
 *
 * Retrieves user subscription data from Stripe.
 * Requires authentication and applies rate limiting.
 *
 * @param request - Next.js request object
 * @returns NextResponse with subscription data or error
 */
export async function handleGetSubscription(
  request: NextRequest
): Promise<NextResponse> {
  const rateLimitResponse = await rateLimit(
    request,
    RATE_LIMIT_CONFIGS.MODERATE
  );
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const data = await getSubscriptionData();
    return NextResponse.json(data);
  } catch (error) {
    const apiError = toApiError(error);

    captureException(error, {
      tags: {
        route: "/api/subscription",
        method: "GET",
        errorCode: apiError.code,
      },
      request,
    });

    logError(error, {
      context: "subscription-api",
      route: "/api/subscription",
    });

    return createApiError(apiError.code, apiError.message);
  }
}
