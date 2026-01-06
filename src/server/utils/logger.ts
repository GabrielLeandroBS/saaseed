/**
 * Server-side logger utilities
 *
 * Re-exports logger for server-side use with additional utilities
 */

import { logger, createLogger } from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";
import { env } from "@/env";

/**
 * Logs an error and optionally sends to Sentry
 *
 * @param error - Error to log
 * @param context - Additional context
 * @param sendToSentry - Whether to send to Sentry (default: true in production)
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>,
  sendToSentry: boolean = env.NODE_ENV === "production"
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  logger.error(
    {
      err: error,
      ...context,
      stack: errorStack,
    },
    errorMessage
  );

  if (sendToSentry && error instanceof Error) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}

/**
 * Logs a warning message
 *
 * @param message - Warning message to log
 * @param context - Additional context to include
 */
export function logWarning(
  message: string,
  context?: Record<string, unknown>
): void {
  logger.warn(context, message);
}

/**
 * Logs an info message
 *
 * @param message - Info message to log
 * @param context - Additional context to include
 */
export function logInfo(
  message: string,
  context?: Record<string, unknown>
): void {
  logger.info(context, message);
}

/**
 * Logs a debug message (only in development)
 *
 * @param message - Debug message to log
 * @param context - Additional context to include
 */
export function logDebug(
  message: string,
  context?: Record<string, unknown>
): void {
  logger.debug(context, message);
}

// Re-export main logger and createLogger
export { logger, createLogger };
