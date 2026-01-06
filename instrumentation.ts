/**
 * Next.js Instrumentation
 *
 * This file runs before the application starts and is used to initialize
 * monitoring tools like Sentry.
 *
 * Note: Uses process.env directly because this runs before env.ts is loaded.
 * NEXT_RUNTIME is a Next.js internal variable, not part of our env schema.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
