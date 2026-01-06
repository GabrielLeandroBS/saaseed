// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
//
// Note: Uses process.env directly because Sentry initializes before env.ts.
// NEXT_PUBLIC_SENTRY_DSN is validated in env.ts for other usages.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Integrations for monitoring
  integrations: [
    // Session Replay for debugging
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    // Browser Tracing with Core Web Vitals (LCP, FID, CLS, INP, TTFB)
    Sentry.browserTracingIntegration({
      enableInp: true, // Interaction to Next Paint
    }),
  ],

  // Set profilesSampleRate to 1.0 to profile 100%
  // of sampled transactions.
  // Since profilesSampleRate is relative to tracesSampleRate,
  // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
  // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 1.0 would
  // results in 50% of transactions being profiled.
  profilesSampleRate: 1.0,
});
