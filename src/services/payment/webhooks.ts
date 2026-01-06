import type Stripe from "stripe";
import { stripe } from "@/server/clients/stripe";
import { supabaseAdmin } from "@/server/clients/supabase";
import { logError, logWarning, logInfo } from "@/server/utils/logger";

/**
 * Finds user ID from metadata array
 *
 * Optimized to use user_id from metadata first (fastest path).
 *
 * @param users - Array of users with metadata
 * @param key - Metadata key to search for
 * @param value - Value to match
 * @returns User ID if found, null otherwise
 */
const findUserByMetadata = (
  users: Array<{ id: string; user_metadata?: Record<string, unknown> }>,
  key: string,
  value: string
): string | null => {
  const foundUser = users.find((user) => user.user_metadata?.[key] === value);
  return foundUser?.id ?? null;
};

/**
 * Finds Supabase user by Better Auth user ID or Stripe customer ID
 *
 * Searches user metadata in Supabase Auth to find matching user.
 * Optimized to check betterAuthUserId first, then stripeCustomerId.
 *
 * @param authUserId - Better Auth user ID (from metadata)
 * @param stripeCustomerId - Stripe customer ID (from metadata)
 * @returns Promise resolving to Supabase user ID or null if not found
 */
async function findSupabaseUserByStripeData(
  authUserId?: string,
  stripeCustomerId?: string
): Promise<string | null> {
  if (!authUserId && !stripeCustomerId) {
    return null;
  }

  try {
    const { data: usersData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError || !usersData) {
      logError(listError, { context: "webhook", action: "listUsers" });
      return null;
    }

    const searchStrategies = [
      { key: "betterAuthUserId", value: authUserId },
      { key: "stripeCustomerId", value: stripeCustomerId },
    ] as const;

    for (const { key, value } of searchStrategies) {
      if (!value) continue;

      const userId = findUserByMetadata(usersData.users, key, value);
      if (userId) return userId;
    }

    logWarning("No user found", {
      context: "webhook",
      authUserId,
      stripeCustomerId,
    });
    return null;
  } catch (error) {
    logError(error, { context: "webhook", action: "findUser" });
    return null;
  }
}

/**
 * Updates subscription status in Supabase user metadata
 *
 * Uses real Stripe subscription status (e.g., "trialing", "active", "past_due").
 * Preserves existing user_metadata and merges subscription data.
 *
 * @param supabaseUserId - Supabase user ID
 * @param stripeSubscription - Stripe subscription object
 * @returns Promise that resolves when update is complete
 */
export async function updateSubscriptionStatus(
  supabaseUserId: string,
  stripeSubscription: Stripe.Subscription
): Promise<void> {
  try {
    const { data: userData, error: getUserError } =
      await supabaseAdmin.auth.admin.getUserById(supabaseUserId);

    if (getUserError || !userData?.user) {
      logError(getUserError, {
        context: "webhook",
        action: "fetchUserForSubscription",
        supabaseUserId,
      });
      return;
    }

    const existingMetadata = userData.user.user_metadata || {};

    const trialEndDate = stripeSubscription.trial_end
      ? new Date(stripeSubscription.trial_end * 1000).toISOString()
      : undefined;

    await supabaseAdmin.auth.admin.updateUserById(supabaseUserId, {
      user_metadata: {
        ...existingMetadata,
        subscription: {
          status: stripeSubscription.status,
          ...(trialEndDate && { trialEnd: trialEndDate }),
          stripeSubscriptionId: stripeSubscription.id,
        },
      },
    });

    logInfo("Updated subscription status", {
      context: "webhook",
      supabaseUserId,
      status: stripeSubscription.status,
    });
  } catch (error) {
    logError(error, {
      context: "webhook",
      action: "updateSubscriptionStatus",
      supabaseUserId,
    });
  }
}

/**
 * Extracts customer ID from Stripe customer object
 *
 * Handles both string IDs and full customer objects.
 *
 * @param customer - Customer object, string ID, or null/undefined
 * @returns Customer ID string or undefined
 */
const getStripeCustomerId = (
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): string | undefined => {
  return typeof customer === "string" ? customer : undefined;
};

export async function handleSubscriptionUpdated(
  stripeSubscription: Stripe.Subscription
): Promise<void> {
  const authUserId = stripeSubscription.metadata?.user_id;
  const stripeCustomerId = getStripeCustomerId(stripeSubscription.customer);

  const supabaseUserId = await findSupabaseUserByStripeData(
    authUserId,
    stripeCustomerId
  );

  if (!supabaseUserId) {
    logWarning("Cannot find user for subscription", {
      context: "webhook",
      subscriptionId: stripeSubscription.id,
    });
    return;
  }

  await updateSubscriptionStatus(supabaseUserId, stripeSubscription);
}

/**
 * Extracts subscription ID from invoice subscription field
 *
 * Handles both string IDs and full subscription objects.
 *
 * @param subscription - Subscription object, string ID, or null/undefined
 * @returns Subscription ID string or null
 */
const getSubscriptionId = (
  subscription: string | Stripe.Subscription | null | undefined
): string | null => {
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
};

/**
 * Processes invoice events by retrieving subscription and updating status
 *
 * @param stripeInvoice - Stripe invoice object from webhook
 * @returns Promise that resolves when processing is complete
 */
async function processInvoiceEvent(
  stripeInvoice: Stripe.Invoice
): Promise<void> {
  const invoiceData = stripeInvoice as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription;
  };

  const subscriptionId = getSubscriptionId(invoiceData.subscription);
  if (!subscriptionId) return;

  const stripeSubscription =
    await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdated(stripeSubscription);
}

/**
 * Handles invoice paid event from Stripe webhook
 *
 * Updates subscription status to active when invoice is paid.
 *
 * @param stripeInvoice - Stripe invoice object from webhook
 * @returns Promise that resolves when processing is complete
 */
export async function handleInvoicePaid(
  stripeInvoice: Stripe.Invoice
): Promise<void> {
  await processInvoiceEvent(stripeInvoice);
}

/**
 * Handles invoice payment failed event from Stripe webhook
 *
 * Updates subscription status to past_due or unpaid when payment fails.
 *
 * @param stripeInvoice - Stripe invoice object from webhook
 * @returns Promise that resolves when processing is complete
 */
export async function handleInvoicePaymentFailed(
  stripeInvoice: Stripe.Invoice
): Promise<void> {
  await processInvoiceEvent(stripeInvoice);
}

/**
 * Handles subscription deleted event from Stripe webhook
 *
 * Updates subscription status to canceled when subscription is deleted.
 *
 * @param stripeSubscription - Stripe subscription object from webhook
 * @returns Promise that resolves when processing is complete
 */
export async function handleSubscriptionDeleted(
  stripeSubscription: Stripe.Subscription
): Promise<void> {
  await handleSubscriptionUpdated(stripeSubscription);
}

/**
 * Handles subscription trial will end event from Stripe webhook
 *
 * Can be used to send notifications to users about trial ending.
 * Updates subscription status in Supabase.
 *
 * @param stripeSubscription - Stripe subscription object from webhook
 * @returns Promise that resolves when processing is complete
 */
export async function handleSubscriptionTrialWillEnd(
  stripeSubscription: Stripe.Subscription
): Promise<void> {
  const trialEndDate = stripeSubscription.trial_end
    ? new Date(stripeSubscription.trial_end * 1000).toISOString()
    : "unknown";

  logInfo("Trial will end", {
    context: "webhook",
    subscriptionId: stripeSubscription.id,
    trialEndDate,
  });

  await handleSubscriptionUpdated(stripeSubscription);
}
