import type Stripe from "stripe";
import { stripe } from "@/server/clients/stripe";
import type { CustomerSyncResult } from "@/models/types/payment";
import type { CustomerResult } from "@/models/types/services/payment";
import type {
  SyncCustomerParams,
  CreateSubscriptionWithTrialParams,
} from "@/models/interfaces/services/payment";
import { createRedisCache } from "@/server/utils/redis/cache";
import {
  REDIS_PREFIXES,
  DEFAULT_CACHE_TTL,
} from "@/server/utils/redis/constants";
import {
  validateEmail,
  validateNonEmptyString,
} from "@/server/utils/validation";
import { normalizeEmail, sanitizeName } from "@/server/utils/sanitization";
import { toError, createError } from "@/server/utils/errors";

/**
 * Redis cache for Stripe customers
 * Uses distributed Redis cache to share customer data across instances
 * All cache operations use Redis (no in-memory cache)
 */
const customerCache = createRedisCache<Stripe.Customer>(
  DEFAULT_CACHE_TTL,
  REDIS_PREFIXES.STRIPE_CUSTOMER
);

/**
 * Compares two metadata objects for equality
 *
 * @param metadata1 - First metadata object
 * @param metadata2 - Second metadata object
 * @returns True if metadata objects are equal, false otherwise
 */
function areMetadataEqual(
  metadata1: Record<string, string> | null | undefined,
  metadata2: Record<string, string> | null | undefined
): boolean {
  const bothNull = !metadata1 && !metadata2;
  if (bothNull) return true;

  const oneIsNull = !metadata1 || !metadata2;
  if (oneIsNull) return false;

  const keys1 = Object.keys(metadata1).sort();
  const keys2 = Object.keys(metadata2).sort();

  const differentLength = keys1.length !== keys2.length;
  if (differentLength) return false;

  return keys1.every((key) => metadata1[key] === metadata2[key]);
}

/**
 * Finds a Stripe customer by email address
 *
 * Uses Redis cache to reduce API calls.
 * Returns cached customer if available, otherwise queries Stripe API.
 *
 * @param email - Customer email address
 * @returns Promise resolving to customer result or error
 */
async function findCustomerByEmail(email: string): Promise<CustomerResult> {
  const cached = await customerCache.get(email);
  if (cached) {
    return { customer: cached };
  }

  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return { error: createError("Customer not found") };
    }

    const customer = customers.data[0];
    await customerCache.set(email, customer);
    return { customer };
  } catch (error) {
    return { error: toError(error) };
  }
}

/**
 * Creates a new Stripe customer
 *
 * Uses idempotency key to prevent duplicate customers on retries.
 * Caches the created customer in Redis.
 *
 * @param email - Customer email address
 * @param name - Customer name (optional)
 * @param metadata - Custom metadata (should include user_id)
 * @param userId - Optional user ID for idempotency key
 * @returns Promise resolving to customer sync result
 */
async function createCustomer({
  email,
  name,
  metadata,
  userId,
}: SyncCustomerParams): Promise<CustomerSyncResult> {
  try {
    const options: Stripe.CustomerCreateParams = {
      email,
      name: name || undefined,
      metadata: metadata || {},
    };

    const requestOptions: Stripe.RequestOptions = {
      ...(userId && { idempotencyKey: `signup_${userId}` }),
    };

    const customer = await stripe.customers.create(options, requestOptions);

    await customerCache.set(email, customer);
    return { customer, isNew: true };
  } catch (error) {
    const errorMessage = toError(error).message;
    const isDuplicateError =
      errorMessage.includes("already exists") ||
      errorMessage.includes("duplicate");

    if (isDuplicateError) {
      const existingCheck = await findCustomerByEmail(email);
      if (existingCheck.customer) {
        return { customer: existingCheck.customer, isNew: false };
      }
    }

    return { error: toError(error) };
  }
}

/**
 * Updates an existing Stripe customer
 *
 * If customer is not found, creates a new one.
 * Updates Redis cache after successful update.
 *
 * @param customerId - Stripe customer ID
 * @param email - Customer email address
 * @param name - Customer name (optional)
 * @param metadata - Custom metadata
 * @returns Promise resolving to customer sync result
 */
async function updateCustomer({
  customerId,
  email,
  name,
  metadata,
}: SyncCustomerParams & { customerId: string }): Promise<CustomerSyncResult> {
  try {
    const customer = await stripe.customers.update(customerId, {
      email,
      name: name || undefined,
      metadata: metadata || {},
    });

    await customerCache.set(email, customer);
    return { customer, isNew: false };
  } catch (error) {
    const errorMessage = toError(error).message;
    const isMissingError =
      errorMessage.includes("No such customer") ||
      errorMessage.includes("resource_missing");

    if (isMissingError) {
      await customerCache.delete(email);
      return createCustomer({
        email,
        name,
        metadata,
        userId: metadata?.user_id,
      });
    }

    return { error: toError(error) };
  }
}

/**
 * Syncs customer from application to Stripe
 *
 * This function:
 * - Creates customer in Stripe if it doesn't exist (with idempotency if userId provided)
 * - Updates customer data if it exists and needs update
 * - Uses Redis cache to reduce API calls (distributed cache)
 * - Uses idempotency keys to prevent duplicate customers on retries
 *
 * @param email - Customer email (used as unique identifier)
 * @param name - Customer name (optional, max 100 chars)
 * @param metadata - Custom metadata to store with customer (should include user_id)
 * @param userId - Optional user ID for idempotency key generation
 * @returns CustomerSyncResult with customer data and sync status
 */
export async function syncCustomerToStripe({
  email,
  name,
  metadata,
}: SyncCustomerParams): Promise<CustomerSyncResult> {
  if (!validateEmail(email)) {
    return { error: createError("Invalid email") };
  }

  const normalizedEmail = normalizeEmail(email);
  const sanitizedName = sanitizeName(name);

  try {
    const existingCustomer = await findCustomerByEmail(normalizedEmail);

    if ("error" in existingCustomer && existingCustomer.error) {
      if (existingCustomer.error.message === "Customer not found") {
        return createCustomer({
          email: normalizedEmail,
          name: sanitizedName,
          metadata,
          userId: metadata?.user_id,
        });
      }
      return { error: existingCustomer.error };
    }

    if (!existingCustomer.customer) {
      return createCustomer({
        email: normalizedEmail,
        name: sanitizedName,
        metadata,
        userId: metadata?.user_id,
      });
    }

    const needsUpdate =
      existingCustomer.customer.email !== normalizedEmail ||
      existingCustomer.customer.name !== sanitizedName ||
      !areMetadataEqual(
        existingCustomer.customer.metadata,
        metadata as Record<string, string> | null
      );

    if (!needsUpdate) {
      return { customer: existingCustomer.customer, isNew: false };
    }

    await customerCache.delete(normalizedEmail);
    return updateCustomer({
      customerId: existingCustomer.customer.id,
      email: normalizedEmail,
      name: sanitizedName,
      metadata,
    });
  } catch (error) {
    return { error: toError(error) };
  }
}

/**
 * Creates a Stripe subscription with trial period
 *
 * This function:
 * - Creates a subscription with specified trial days (with idempotency if userId provided)
 * - Sets payment_behavior to "default_incomplete" (requires payment method later)
 * - Expands latest_invoice.payment_intent for payment handling
 * - Adds metadata with user_id for tracking
 * - Uses idempotency keys to prevent duplicate subscriptions on retries
 *
 * @param customerId - Stripe customer ID
 * @param priceId - Stripe price ID (from STRIPE_DEFAULT_PRICE_ID env var)
 * @param trialPeriodDays - Number of trial days (default: 7)
 * @param userId - Optional user ID for idempotency key generation and metadata
 * @returns SubscriptionSyncResult with subscription data (includes real Stripe status)
 */
export async function createSubscriptionWithTrial(
  params: CreateSubscriptionWithTrialParams
): Promise<
  | { subscription: Stripe.Subscription; error?: never }
  | { subscription?: never; error: Error }
> {
  const { customerId, priceId, trialPeriodDays = 7, userId } = params;

  if (!validateNonEmptyString(customerId)) {
    return { error: createError("Invalid customerId") };
  }

  if (!validateNonEmptyString(priceId)) {
    return { error: createError("Invalid priceId") };
  }

  if (typeof trialPeriodDays !== "number" || trialPeriodDays < 0) {
    return { error: createError("Invalid trialPeriodDays") };
  }

  try {
    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialPeriodDays,
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      metadata: userId ? { user_id: userId } : undefined,
    };

    const requestOptions: Stripe.RequestOptions = {
      ...(userId && { idempotencyKey: `sub_${userId}` }),
    };

    const subscription = await stripe.subscriptions.create(
      subscriptionParams,
      requestOptions
    );

    return { subscription };
  } catch (error) {
    return { error: toError(error) };
  }
}
