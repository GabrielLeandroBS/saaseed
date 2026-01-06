# ADR-003: Stripe for Payments

## Status

Accepted

## Context

The project needs:

- Payment processing
- Subscription management
- Trial periods
- Billing portal for customers
- Webhooks for synchronization

## Decision

We adopted **Stripe** as the payment platform, using:

- **Subscriptions**: With automatic 7-day trial period
- **Billing Portal**: For customers to manage payments
- **Webhooks**: To synchronize status with Supabase

### Flow

1. User authenticates (Better Auth)
2. `after` hook creates customer in Stripe
3. Subscription created with 7 days trial
4. Webhooks update status in Supabase
5. Frontend queries `/api/subscription` for current status

## Alternatives Considered

### Paddle

- **Pros**: Merchant of Record (simplifies taxes), good API
- **Cons**: Less popular in Brazil, higher fees

### LemonSqueezy

- **Pros**: Merchant of Record, modern UI, good for digital products
- **Cons**: Fewer features than Stripe, smaller community

### PayPal

- **Pros**: Very well-known, accepted globally
- **Cons**: Old API, poor UX, high fees

### Mercado Pago

- **Pros**: Popular in Brazil, Pix integrated
- **Cons**: Less robust API, fewer subscription features

## Consequences

### Positive

1. **Robustness**: Mature and reliable platform
2. **Documentation**: Excellent documentation and examples
3. **TypeScript SDK**: Full typing
4. **Billing Portal**: Ready UI for customers
5. **Webhooks**: Automatic synchronization
6. **Test Mode**: Easy to test without real money

### Negative

1. **Complexity**: Many concepts (customer, subscription, invoice, etc.)
2. **Fees**: 2.9% + $0.30 per transaction (US)
3. **Compliance**: Need to handle PCI DSS (Stripe helps)

## Implementation

### Client

```typescript
// src/server/clients/stripe.ts
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-18.acacia",
});
```

### Create Subscription with Trial

```typescript
// src/services/payment/stripe.ts
export async function createSubscriptionWithTrial(params) {
  return stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    trial_period_days: 7,
    payment_behavior: "default_incomplete",
    payment_settings: {
      save_default_payment_method: "on_subscription",
    },
  });
}
```

### Processed Webhooks

| Event                                  | Action                     |
| -------------------------------------- | -------------------------- |
| `customer.subscription.updated`        | Updates status in Supabase |
| `customer.subscription.deleted`        | Marks as canceled          |
| `customer.subscription.trial_will_end` | Log (can send email)       |
| `invoice.paid`                         | Updates status to active   |
| `invoice.payment_failed`               | Updates status to past_due |

### Idempotency

We use idempotency keys to avoid duplicates:

```typescript
const requestOptions = {
  idempotencyKey: `signup_${userId}`, // Customer
  idempotencyKey: `sub_${userId}`, // Subscription
};
```

## References

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
