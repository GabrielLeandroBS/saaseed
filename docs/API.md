# 📡 API Documentation

> Complete documentation of the SaaS Seed API endpoints.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via Better Auth. Sessions are stored in encrypted cookies (JWE).

### Common Headers

```http
Content-Type: application/json
Cookie: better-auth.session_token=<token>
```

---

## Endpoints

### 🔐 Authentication (`/api/auth/[...all]`)

Better Auth automatically manages all authentication endpoints.

#### Available Endpoints

| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| POST   | `/api/auth/sign-in/email`     | Sign in via email/password |
| POST   | `/api/auth/sign-up/email`     | Sign up via email/password |
| POST   | `/api/auth/sign-in/social`    | Sign in via OAuth (Google) |
| POST   | `/api/auth/magic-link/send`   | Send magic link            |
| GET    | `/api/auth/magic-link/verify` | Verify magic link          |
| POST   | `/api/auth/sign-out`          | Sign out                   |
| GET    | `/api/auth/session`           | Get current session        |

#### Magic Link - Send

```http
POST /api/auth/magic-link/send
Content-Type: application/json

{
  "email": "user@example.com",
  "callbackURL": "/dashboard"
}
```

**Response (200)**

```json
{
  "success": true
}
```

#### OAuth - Google

```http
POST /api/auth/sign-in/social
Content-Type: application/json

{
  "provider": "google",
  "callbackURL": "/dashboard"
}
```

**Response (302)** - Redirect to Google OAuth

---

### 💳 Checkout (`/api/checkout`)

Creates a Stripe Billing Portal session to manage payments.

#### POST `/api/checkout`

**Authentication:** Required

**Rate Limit:** 30 requests/minute

**Request**

```http
POST /api/checkout
Content-Type: application/json
Cookie: better-auth.session_token=<token>
```

**Response (200)**

```json
{
  "checkoutUrl": "https://billing.stripe.com/p/session/..."
}
```

**Errors**

| Status | Code         | Description                              |
| ------ | ------------ | ---------------------------------------- |
| 401    | UNAUTHORIZED | User not authenticated                   |
| 404    | NOT_FOUND    | User, customer or subscription not found |
| 429    | -            | Rate limit exceeded                      |
| 502    | STRIPE_ERROR | Stripe API error                         |

---

### 📊 Subscription (`/api/subscription`)

Returns user subscription data directly from Stripe.

#### GET `/api/subscription`

**Authentication:** Required

**Rate Limit:** 30 requests/minute

**Request**

```http
GET /api/subscription
Cookie: better-auth.session_token=<token>
```

**Response (200)**

```json
{
  "status": "trialing",
  "trialEnd": "2024-01-15T00:00:00.000Z",
  "trialStart": "2024-01-08T00:00:00.000Z",
  "currentPeriodEnd": "2024-02-08T00:00:00.000Z",
  "currentPeriodStart": "2024-01-08T00:00:00.000Z",
  "cancelAtPeriodEnd": false,
  "hasPaymentMethod": true,
  "paymentMethod": {
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2025
    }
  },
  "latestInvoice": {
    "id": "in_xxx",
    "amount": 2900,
    "currency": "brl",
    "status": "paid",
    "paid": true,
    "dueDate": null
  },
  "subscriptionId": "sub_xxx",
  "customerId": "cus_xxx"
}
```

**Subscription Status Values**

| Status               | Description                    |
| -------------------- | ------------------------------ |
| `trialing`           | In trial period                |
| `active`             | Active and paid subscription   |
| `past_due`           | Payment pending (grace period) |
| `canceled`           | Subscription canceled          |
| `unpaid`             | Payment failed                 |
| `incomplete`         | Initial payment pending        |
| `incomplete_expired` | Initial payment expired        |
| `paused`             | Subscription paused            |

**Errors**

| Status | Code         | Description                              |
| ------ | ------------ | ---------------------------------------- |
| 401    | UNAUTHORIZED | User not authenticated                   |
| 404    | NOT_FOUND    | User, customer or subscription not found |
| 429    | -            | Rate limit exceeded                      |
| 502    | STRIPE_ERROR | Stripe API error                         |

---

### 📧 Resend (`/api/resend`)

Sends transactional emails via Resend API.

#### POST `/api/resend`

**Authentication:** Not required (use with caution)

**Rate Limit:** 10 requests/minute (STRICT)

**Request**

```http
POST /api/resend
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<h1>Hello World</h1>",
  "from": "sender@yourdomain.com"
}
```

| Field     | Type   | Required | Description                                   |
| --------- | ------ | -------- | --------------------------------------------- |
| `to`      | string | Yes      | Recipient email                               |
| `subject` | string | Yes      | Subject (max 200 chars)                       |
| `html`    | string | Yes      | HTML content (sanitized)                      |
| `from`    | string | No       | Sender email (default: onboarding@resend.dev) |

**Response (200)**

```json
{
  "data": {
    "id": "email_xxx"
  },
  "success": true
}
```

**Errors**

| Status | Code             | Description                 |
| ------ | ---------------- | --------------------------- |
| 400    | VALIDATION_ERROR | Invalid data or unsafe HTML |
| 429    | -                | Rate limit exceeded         |
| 500    | INTERNAL_ERROR   | Internal error              |

**Security**

- HTML is sanitized to remove XSS patterns
- Fields are validated with Zod schemas

---

### 🔔 Stripe Webhook (`/api/webhooks/stripe`)

Processes Stripe events (subscriptions, invoices).

#### POST `/api/webhooks/stripe`

**Authentication:** Stripe Signature (header `stripe-signature`)

**Rate Limit:** 100 requests/minute (RELAXED)

**Required Headers**

```http
stripe-signature: t=xxx,v1=xxx,v0=xxx
Content-Type: application/json
```

**Processed Events**

| Event                                  | Description                |
| -------------------------------------- | -------------------------- |
| `customer.subscription.updated`        | Subscription updated       |
| `customer.subscription.deleted`        | Subscription canceled      |
| `customer.subscription.trial_will_end` | Trial will expire (3 days) |
| `invoice.paid`                         | Invoice paid               |
| `invoice.payment_failed`               | Payment failed             |

**Response (200)**

```json
{
  "received": true
}
```

**Errors**

| Status | Code             | Description                  |
| ------ | ---------------- | ---------------------------- |
| 400    | VALIDATION_ERROR | Invalid or missing signature |
| 429    | -                | Rate limit exceeded          |
| 500    | INTERNAL_ERROR   | Error processing webhook     |

---

### ❤️ Health (`/api/health`)

Checks the health of external services.

#### GET `/api/health`

**Authentication:** Not required

**Request**

```http
GET /api/health
```

**Response (200)** - All services healthy

```json
{
  "status": "healthy",
  "timestamp": "2024-01-08T12:00:00.000Z",
  "checks": {
    "redis": true,
    "supabase": true,
    "stripe": true
  }
}
```

**Response (503)** - Some service with issues

```json
{
  "status": "degraded",
  "timestamp": "2024-01-08T12:00:00.000Z",
  "checks": {
    "redis": true,
    "supabase": false,
    "stripe": true
  },
  "errors": ["Supabase is unavailable"]
}
```

---

## Error Response Format

All errors follow the standard format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Error Codes

| Code                  | HTTP Status | Description             |
| --------------------- | ----------- | ----------------------- |
| `UNAUTHORIZED`        | 401         | Not authenticated       |
| `FORBIDDEN`           | 403         | No permission           |
| `NOT_FOUND`           | 404         | Resource not found      |
| `VALIDATION_ERROR`    | 400         | Invalid data            |
| `INVALID_EMAIL`       | 400         | Invalid email           |
| `INVALID_INPUT`       | 400         | Invalid input           |
| `ALREADY_EXISTS`      | 409         | Resource already exists |
| `STRIPE_ERROR`        | 502         | Stripe API error        |
| `SUPABASE_ERROR`      | 502         | Supabase API error      |
| `INTERNAL_ERROR`      | 500         | Internal error          |
| `SERVICE_UNAVAILABLE` | 503         | Service unavailable     |

---

## Rate Limiting

Rate limiting is applied using Redis (Upstash) with sliding window algorithm.

### Configurations

| Config   | Requests | Window | Used in                              |
| -------- | -------- | ------ | ------------------------------------ |
| STRICT   | 10       | 1 min  | `/api/resend`                        |
| MODERATE | 30       | 1 min  | `/api/checkout`, `/api/subscription` |
| RELAXED  | 100      | 1 min  | `/api/webhooks/stripe`               |

### Response (429)

```json
{
  "error": "Too many requests, please try again later"
}
```

---

## Security

### Security Headers

Configured in `next.config.ts`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (production)

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
font-src 'self';
connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.sentry.io;
frame-src https://js.stripe.com https://hooks.stripe.com;
```

### Input Validation

- All inputs are validated with Zod schemas
- HTML is sanitized to remove XSS patterns
- Emails are normalized (trim + lowercase)

---

## Changelog

### v1.0.0

- Initial API release
- Authentication via Better Auth (magic link + Google OAuth)
- Stripe integration (checkout, subscription, webhooks)
- Health check endpoint
- Rate limiting via Redis
