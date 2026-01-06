# ADR-001: Authentication with Better Auth

## Status

Accepted

## Context

The project needs a robust authentication system that supports:

- Magic link (passwordless)
- OAuth (Google)
- Secure sessions
- Integration with Next.js App Router

We needed to choose between several authentication options available in the Next.js ecosystem.

## Decision

We adopted **Better Auth** in stateless mode, storing sessions in encrypted cookies (JWE).

### Configuration

```typescript
// src/lib/auth/auth.ts
export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      strategy: "jwe",
      refreshCache: true,
    },
  },
  plugins: [
    nextCookies(),
    magicLink({ ... }),
  ],
});
```

## Alternatives Considered

### NextAuth.js (Auth.js)

- **Pros**: Very popular, large community, many providers
- **Cons**: Complex API, verbose configuration, issues with App Router

### Clerk

- **Pros**: Ready UI, easy to use, many features
- **Cons**: Vendor lock-in, cost in production, less control

### Supabase Auth (standalone)

- **Pros**: We already use Supabase, native integration
- **Cons**: Less flexible, difficult to customize flows

### Lucia Auth

- **Pros**: Lightweight, flexible, good for learning
- **Cons**: Requires more boilerplate code, fewer plugins

## Consequences

### Positive

1. **Stateless**: No database needed for sessions
2. **Secure**: Encrypted JWE cookies
3. **Flexible**: Easy to add new providers
4. **Performance**: Sessions in cookies = fewer queries
5. **Developer Experience**: Simple and intuitive API
6. **Hooks**: `after` hook allows automatic sync with Supabase/Stripe

### Negative

1. **Less popular**: Smaller community than NextAuth
2. **Documentation**: Fewer examples available
3. **Cookie size**: Large sessions may hit 4KB limit

## Implementation

### Server-side

```typescript
// src/server/actions.ts
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
```

### Client-side

```typescript
// src/lib/auth/client.ts
export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  plugins: [magicLinkClient()],
});
```

### Sync Hook

```typescript
// Automatically syncs user to Supabase and Stripe after auth
hooks: {
  after: createAuthMiddleware(async (ctx) => {
    if (ctx.context.newSession?.user) {
      await syncUserAfterAuth({ ... });
    }
  }),
}
```

## References

- [Better Auth Documentation](https://www.better-auth.com/)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
