import { syncUserToSupabase } from "@/services/auth/supabase";
import {
  syncCustomerToStripe,
  createSubscriptionWithTrial,
} from "@/services/payment/stripe";
import { supabaseAdmin } from "@/server/clients/supabase";
import { stripe } from "@/server/clients/stripe";
import { env } from "@/env";
import type { SyncUserParams } from "@/models/interfaces/services/auth";
import { validateEmail } from "@/server/utils/validation";
import { TRIAL_CONFIG } from "@/models/constants/trials";
import { logError, logInfo } from "@/server/utils/logger";

/**
 * Gets error or creates fallback error
 *
 * @param error - Optional error object
 * @param fallbackMessage - Fallback error message
 * @returns Error object (original or new with fallback message)
 */
const getErrorOrFallback = (
  error: Error | undefined,
  fallbackMessage: string
): Error => error ?? new Error(fallbackMessage);

/**
 * Synchronizes user to Supabase Auth with error handling
 *
 * Wraps syncUserToSupabase with proper error handling.
 *
 * @param userData - User data to sync
 * @returns Promise resolving to user result or error
 */
async function syncUserToSupabaseAuth(userData: SyncUserParams): Promise<
  | {
      user: NonNullable<Awaited<ReturnType<typeof syncUserToSupabase>>["user"]>;
      error?: never;
    }
  | { user?: never; error: Error }
> {
  const result = await syncUserToSupabase(userData);

  if (result.error || !result.user) {
    return { error: getErrorOrFallback(result.error, "Failed to sync user") };
  }

  return { user: result.user };
}

/**
 * Synchronizes customer to Stripe API with error handling
 *
 * Wraps syncCustomerToStripe with proper error handling.
 *
 * @param email - Customer email address
 * @param name - Customer name (optional)
 * @param userId - Better Auth user ID
 * @param supabaseUserId - Supabase user ID
 * @returns Promise resolving to customer result or error
 */
async function syncCustomerToStripeApi(
  email: string,
  name: string | null | undefined,
  userId: string,
  supabaseUserId: string
): Promise<
  | {
      customer: NonNullable<
        Awaited<ReturnType<typeof syncCustomerToStripe>>["customer"]
      >;
      error?: never;
    }
  | { customer?: never; error: Error }
> {
  const result = await syncCustomerToStripe({
    email,
    name,
    metadata: {
      user_id: userId,
      supabaseUserId,
    },
    userId,
  });

  if (result.error || !result.customer) {
    return {
      error: getErrorOrFallback(result.error, "Failed to sync customer"),
    };
  }

  return { customer: result.customer };
}

/**
 * Checks if a subscription exists and is active in Stripe
 *
 * @param subscriptionId - Stripe subscription ID
 * @returns Promise resolving to object with exists and isActive flags
 */
async function checkExistingSubscription(
  subscriptionId: string
): Promise<{ exists: boolean; isActive: boolean }> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return {
      exists: true,
      isActive: !subscription.canceled_at,
    };
  } catch {
    return { exists: false, isActive: false };
  }
}

/**
 * Updates Stripe customer metadata
 *
 * Silently fails if update fails (non-critical operation).
 *
 * @param customerId - Stripe customer ID
 * @param metadata - Metadata to update
 * @returns Promise that resolves when update is complete (or fails silently)
 */
async function updateStripeCustomerMetadata(
  customerId: string,
  metadata: Record<string, string>
): Promise<void> {
  await stripe.customers.update(customerId, { metadata }).catch(() => {});
}

/**
 * Creates a trial subscription for a customer
 *
 * Uses default price ID and trial period from constants.
 *
 * @param customerId - Stripe customer ID
 * @param userId - Better Auth user ID (for idempotency)
 * @returns Promise resolving to subscription data or error
 */
async function createTrialSubscription(
  customerId: string,
  userId: string
): Promise<{ subscriptionId: string; status: string } | { error: Error }> {
  const result = await createSubscriptionWithTrial({
    customerId,
    priceId: env.STRIPE_DEFAULT_PRICE_ID,
    trialPeriodDays: TRIAL_CONFIG.DEFAULT_DAYS,
    userId,
  });

  if (result.error) {
    return { error: result.error };
  }

  const status = result.subscription.status;

  return {
    subscriptionId: result.subscription.id,
    status,
  };
}

/**
 * Updates Supabase user metadata by merging with new updates
 *
 * Preserves existing metadata and merges new values.
 * Logs errors but does not throw (non-critical operation).
 *
 * @param userId - Supabase user ID
 * @param currentMetadata - Current user metadata
 * @param updates - New metadata values to merge
 * @returns Promise that resolves when update is complete
 */
async function updateSupabaseUserMetadata(
  userId: string,
  currentMetadata: Record<string, unknown>,
  updates: Record<string, unknown>
): Promise<void> {
  await supabaseAdmin.auth.admin
    .updateUserById(userId, {
      user_metadata: {
        ...currentMetadata,
        ...updates,
      },
    })
    .catch((error: unknown) => {
      logError(error, {
        context: "auth-sync",
        action: "updateUserMetadata",
        userId,
      });
    });
}

/**
 * Synchronizes user data after authentication
 *
 * This function is called automatically after successful authentication
 * (sign-in, sign-up, magic link, OAuth).
 *
 * Flow (sequential to handle dependencies):
 * 1. Syncs user to Supabase Auth (creates/updates user in auth.users)
 * 2. Syncs customer to Stripe with idempotency (uses user_id in metadata)
 * 3. Checks if subscription already exists (prevents duplicate subscriptions)
 * 4. Creates subscription with 7-day trial if it doesn't exist (with idempotency)
 * 5. Updates user_metadata in Supabase with Stripe customer ID and subscription info
 *    - Uses real Stripe subscription status (e.g., "trialing", "active", "past_due")
 *
 * @param userData - User data from Better Auth session
 * @returns Promise that resolves when sync is complete (logs errors, doesn't throw)
 */
export async function syncUserAfterAuth(
  userData: SyncUserParams
): Promise<void> {
  const { userId, email, name } = userData;

  if (!validateEmail(email)) {
    logError(new Error("Invalid email format"), {
      context: "auth-sync",
      email,
    });
    return;
  }

  const supabaseResult = await syncUserToSupabaseAuth(userData);

  if (supabaseResult.error || !supabaseResult.user) {
    logError(supabaseResult.error, {
      context: "auth-sync",
      action: "syncToSupabase",
    });
    return;
  }

  const supabaseUser = supabaseResult.user;

  const stripeResult = await syncCustomerToStripeApi(
    email,
    name,
    userId,
    supabaseUser.id
  );

  if (stripeResult.error || !stripeResult.customer) {
    logError(stripeResult.error, {
      context: "auth-sync",
      action: "syncToStripe",
    });
    return;
  }

  const stripeCustomer = stripeResult.customer;

  const existingSubscriptionId = supabaseUser.user_metadata?.subscription
    ?.stripeSubscriptionId as string | undefined;

  if (existingSubscriptionId) {
    const subscriptionCheck = await checkExistingSubscription(
      existingSubscriptionId
    );

    const isActiveSubscription =
      subscriptionCheck.exists && subscriptionCheck.isActive;

    if (isActiveSubscription) {
      await updateStripeCustomerMetadata(stripeCustomer.id, {
        user_id: userId,
        ...stripeCustomer.metadata,
        supabaseUserId: supabaseUser.id,
      });

      logInfo("Subscription already exists, skipping creation", {
        context: "auth-sync",
      });
      return;
    }
  }

  const subscriptionResult = await createTrialSubscription(
    stripeCustomer.id,
    userId
  );

  const hasError = "error" in subscriptionResult;

  if (hasError) {
    logError(subscriptionResult.error, {
      context: "auth-sync",
      action: "createSubscription",
    });

    await updateSupabaseUserMetadata(
      supabaseUser.id,
      supabaseUser.user_metadata || {},
      {
        stripeCustomerId: stripeCustomer.id,
      }
    );
    return;
  }

  await updateSupabaseUserMetadata(
    supabaseUser.id,
    supabaseUser.user_metadata || {},
    {
      stripeCustomerId: stripeCustomer.id,
      subscription: {
        status: subscriptionResult.status,
        stripeSubscriptionId: subscriptionResult.subscriptionId,
      },
    }
  );
}
