# ADR-006: Sentry for Monitoring

## Status

Accepted

## Context

The project needs:

- Error tracking in production
- Performance monitoring
- Session replay for debugging
- Critical error alerts

## Decision

We adopted **Sentry** as the monitoring platform.

### Configuration

- **Client**: Browser errors + Core Web Vitals
- **Server**: Server-side errors
- **Edge**: Edge runtime errors

## Alternatives Considered

### LogRocket

- **Pros**: Excellent session replay, good for UX
- **Cons**: Focus on replay, less on errors

### Datadog

- **Pros**: Very complete, APM, logs, traces
- **Cons**: Expensive, complex for MVP

### New Relic

- **Pros**: Robust APM, many integrations
- **Cons**: Expensive, learning curve

### Vercel Analytics + Logs

- **Pros**: Native integration, simple
- **Cons**: Fewer error tracking features

## Consequences

### Positive

1. **Error Tracking**: Automatic error capture
2. **Performance**: Core Web Vitals (LCP, FID, CLS, INP, TTFB)
3. **Session Replay**: Reproduce sessions with errors
4. **Alerts**: Critical error notifications
5. **Source Maps**: Readable stack traces
6. **Free tier**: 5k errors/month free

### Negative

1. **Bundle size**: SDK adds ~30KB
2. **Privacy**: Session replay needs care with sensitive data
3. **Configuration**: Multiple config files

## Implementation

### Client Config

```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],
});
```

### Server Config

```typescript
// sentry.server.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Utility Functions

```typescript
// src/server/utils/sentry.ts
export function captureException(error, context) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    Sentry.captureException(error);
  });
}
```

### Error Boundaries

```typescript
// src/app/error.tsx
export default function Error({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <ErrorUI error={error} reset={reset} />;
}
```

### Logger Integration

```typescript
// src/server/utils/logger.ts
export function logError(error, context, sendToSentry = true) {
  logger.error({ err: error, ...context }, error.message);

  if (sendToSentry && env.NODE_ENV === "production") {
    Sentry.captureException(error, { extra: context });
  }
}
```

### Privacy

Session Replay configured with:

- `maskAllText: true` - Masks all text
- `blockAllMedia: true` - Blocks images/videos

## References

- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
