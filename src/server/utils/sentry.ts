import * as Sentry from "@sentry/nextjs";
import type { NextRequest } from "next/server";
import { toError } from "./errors";

/**
 * Captures an exception to Sentry with additional context
 *
 * @param error - Error to capture
 * @param context - Additional context to include
 */
export function captureException(
  error: unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    user?: { id?: string; email?: string };
    request?: NextRequest;
  }
): void {
  const errorObj = toError(error);

  Sentry.withScope((scope) => {
    // Add tags
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Add extra context
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    // Add user context
    if (context?.user) {
      scope.setUser(context.user);
    }

    // Add request context
    if (context?.request) {
      scope.setContext("request", {
        url: context.request.url,
        method: context.request.method,
        headers: Object.fromEntries(context.request.headers.entries()),
      });
    }

    // Capture the exception
    Sentry.captureException(errorObj);
  });
}

/**
 * Captures a message to Sentry
 *
 * @param message - Message to capture
 * @param level - Severity level (default: 'info')
 * @param context - Additional context to include
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): void {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    scope.setLevel(level);
    Sentry.captureMessage(message);
  });
}

