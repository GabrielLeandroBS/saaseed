# ADR-004: Upstash Redis for Cache and Rate Limiting

## Status

Accepted

## Context

The project needs:

- Distributed cache (for multiple instances)
- Rate limiting for APIs
- Temporary data storage
- Serverless compatibility (Vercel)

## Decision

We adopted **Upstash Redis** as the cache and rate limiting solution.

### Main Usage

1. **Rate Limiting**: Sliding window algorithm for APIs
2. **Cache**: Stripe customers to reduce API calls
3. **Health Check**: Availability verification

## Alternatives Considered

### Redis Cloud (Redis Labs)

- **Pros**: Full Redis, many features
- **Cons**: Not serverless-native, cold starts

### Vercel KV

- **Pros**: Native integration with Vercel, based on Upstash
- **Cons**: Vercel vendor lock-in, less control

### In-memory Cache (Map)

- **Pros**: Simple, no external dependencies
- **Cons**: Doesn't work with multiple instances, loses data on restart

### Cloudflare KV

- **Pros**: Edge-first, good for Cloudflare
- **Cons**: Eventual consistency, not Redis

## Consequences

### Positive

1. **Serverless-native**: Works well with Vercel
2. **HTTP API**: No persistent connection needed
3. **Generous free tier**: 10k requests/day free
4. **Global**: Edge locations for low latency
5. **Redis API**: Familiar Redis commands

### Negative

1. **HTTP overhead**: Slower than Redis TCP
2. **Limitations**: Some Redis commands not available
3. **Cost**: Can scale in production

## Implementation

### Client

```typescript
// src/server/clients/redis.ts
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});
```

### Rate Limiting

```typescript
// src/server/utils/redis/rate-limit.ts
export async function rateLimit(request, config) {
  const key = `rate_limit:${clientIdentifier}`;
  const current = await redis.get(key);

  if (current >= config.maxRequests) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await redis.incr(key);
  return null; // Allow request
}
```

### Rate Limit Configurations

| Config   | Requests | Window | Usage                  |
| -------- | -------- | ------ | ---------------------- |
| STRICT   | 10       | 1 min  | Resend API             |
| MODERATE | 30       | 1 min  | Checkout, Subscription |
| RELAXED  | 100      | 1 min  | Webhooks               |

### Cache Factory

```typescript
// src/server/utils/redis/cache.ts
export function createRedisCache<T>(ttl, prefix) {
  return {
    get: (key) => redis.get(`${prefix}:${key}`),
    set: (key, data) => redis.setex(`${prefix}:${key}`, ttl, data),
    delete: (key) => redis.del(`${prefix}:${key}`),
    // ...
  };
}
```

### Fail Open Strategy

If Redis fails, we allow the request to not break the application:

```typescript
try {
  // Rate limit check
} catch (error) {
  logWarning("Rate limiting disabled - Redis unavailable");
  return false; // Allow request
}
```

## References

- [Upstash Documentation](https://docs.upstash.com/)
- [Upstash Redis](https://docs.upstash.com/redis)
- [Rate Limiting Algorithms](https://blog.upstash.com/rate-limiting)
