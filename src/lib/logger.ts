import pino from "pino";
import { env } from "@/env";

/**
 * Logger configuration
 *
 * Uses Pino for structured logging with different configurations
 * for development and production environments.
 */
const isDevelopment = env.NODE_ENV === "development";

/**
 * Base logger configuration
 */
const baseConfig: pino.LoggerOptions = {
  level: isDevelopment ? "debug" : "info",
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

/**
 * Development logger with pretty printing
 */
const devConfig: pino.LoggerOptions = {
  ...baseConfig,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
      singleLine: false,
    },
  },
};

/**
 * Production logger (JSON output)
 */
const prodConfig: pino.LoggerOptions = {
  ...baseConfig,
  serializers: {
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
};

/**
 * Main logger instance
 *
 * Use this logger throughout the application instead of console.log
 *
 * @example
 * ```ts
 * import { logger } from "@/lib/logger";
 * logger.info({ userId: "123" }, "User logged in");
 * logger.error({ error }, "Failed to process payment");
 * ```
 */
export const logger = isDevelopment ? pino(devConfig) : pino(prodConfig);

/**
 * Create a child logger with bound context
 *
 * Useful for adding context to all logs in a specific module or function
 *
 * @example
 * ```ts
 * const moduleLogger = logger.child({ module: "auth" });
 * moduleLogger.info("Processing authentication");
 * ```
 */
export function createLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}
