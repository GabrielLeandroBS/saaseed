# 📋 Architecture Decision Records (ADRs)

> Documentation of architectural decisions for the SaaS Seed project.

## What are ADRs?

Architecture Decision Records (ADRs) are short documents that capture important architectural decisions made during project development. Each ADR describes a decision, its context, alternatives considered, and consequences.

## Index

| ADR                                        | Title                           | Status   | Date    |
| ------------------------------------------ | ------------------------------- | -------- | ------- |
| [001](./001-authentication-better-auth.md) | Authentication with Better Auth | Accepted | 2024-01 |
| [002](./002-database-supabase.md)          | Supabase as Database            | Accepted | 2024-01 |
| [003](./003-payments-stripe.md)            | Stripe for Payments             | Accepted | 2024-01 |
| [004](./004-caching-upstash-redis.md)      | Upstash Redis for Cache         | Accepted | 2024-01 |
| [005](./005-styling-tailwind-shadcn.md)    | Tailwind CSS + shadcn/ui        | Accepted | 2024-01 |
| [006](./006-monitoring-sentry.md)          | Sentry for Monitoring           | Accepted | 2024-01 |
| [007](./007-i18n-strategy.md)              | Internationalization Strategy   | Accepted | 2024-01 |
| [008](./008-state-management.md)           | State Management                | Accepted | 2024-01 |

## Template

To create a new ADR, use the [template](./template.md).

## Status

- **Proposed**: Decision under discussion
- **Accepted**: Decision approved and implemented
- **Deprecated**: Decision replaced by another
- **Rejected**: Decision not approved

## References

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's Blog Post](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
