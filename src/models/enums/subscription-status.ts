/**
 * Stripe subscription status enum
 *
 * Possible values according to Stripe documentation:
 * - incomplete: Payment is pending
 * - incomplete_expired: Payment attempt failed and subscription is no longer active
 * - trialing: Subscription is in trial period
 * - active: Subscription is active and paid
 * - past_due: Payment failed but subscription is still active (grace period)
 * - canceled: Subscription was canceled
 * - unpaid: Payment failed and subscription is no longer active
 * - paused: Subscription is paused (if using billing portal)
 */
export enum SubscriptionStatus {
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  UNPAID = "unpaid",
  PAUSED = "paused",
}
