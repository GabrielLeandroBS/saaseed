# ADR-002: Supabase as Database

## Status

Accepted

## Context

The project needs:

- Managed PostgreSQL database
- User management (for RLS)
- File storage (future)
- Realtime subscriptions (future)

## Decision

We adopted **Supabase** as the database platform, primarily using:

- **Auth**: For user management and RLS (Row Level Security)
- **Database**: Managed PostgreSQL (future)

### Important

Better Auth is the primary authentication source. Supabase Auth is only used for:

1. Storing user metadata (stripeCustomerId, subscription status)
2. Enabling RLS in future tables
3. Maintaining compatibility with Supabase ecosystem

## Alternatives Considered

### PlanetScale

- **Pros**: Serverless MySQL, branching, good DX
- **Cons**: No native RLS, no integrated auth, cost

### Neon

- **Pros**: Serverless PostgreSQL, branching, good pricing
- **Cons**: No integrated auth, fewer features than Supabase

### Prisma + Railway/Render

- **Pros**: Total flexibility, any provider
- **Cons**: More complex to manage, no extra features

### Firebase

- **Pros**: Very popular, many features, good free tier
- **Cons**: Google vendor lock-in, NoSQL (Firestore), difficult to migrate

## Consequences

### Positive

1. **All-in-one**: Auth, Database, Storage, Realtime in one place
2. **PostgreSQL**: Robust relational database
3. **RLS**: Row-level security
4. **Generous free tier**: Good for MVPs
5. **TypeScript SDK**: Full typing
6. **Dashboard**: UI to manage data

### Negative

1. **Vendor lock-in**: Difficult to migrate to another provider
2. **Complexity**: Two auth layers (Better Auth + Supabase)
3. **Sync required**: Need to keep data synchronized

## Implementation

### Clients

```typescript
// Client-side (respects RLS)
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-side (bypass RLS)
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

### User Sync

When a user authenticates via Better Auth, we sync to Supabase:

```typescript
// src/services/auth/supabase.ts
export async function syncUserToSupabase(params: SyncUserParams) {
  // Creates or updates user in auth.users
  // Stores betterAuthUserId, stripeCustomerId in metadata
}
```

### Stored Metadata

```typescript
user_metadata: {
  betterAuthUserId: "ba_xxx",
  stripeCustomerId: "cus_xxx",
  subscription: {
    status: "trialing",
    stripeSubscriptionId: "sub_xxx",
    trialEnd: "2024-01-15T00:00:00.000Z"
  }
}
```

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
