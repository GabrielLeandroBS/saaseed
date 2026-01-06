import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/server/clients/redis";
import { REDIS_PREFIXES } from "./constants";
import type { RateLimitConfig } from "@/models/interfaces/server/redis";
import { logError, logWarning } from "@/server/utils/logger";
import { captureMessage } from "@/server/utils/sentry";
import { env } from "@/env";

/**
 * Extracts client identifier from request for rate limiting
 *
 * Uses IP address and user agent to create a unique identifier.
 *
 * @param request - Next.js request object
 * @returns Client identifier string (IP:UserAgent)
 */
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `${ip}:${userAgent}`;
}

/**
 * Generates user-based identifier for rate limiting
 *
 * @param userId - User identifier
 * @returns Redis key for user-based rate limiting
 */
function getUserIdentifier(userId: string): string {
  return `${REDIS_PREFIXES.RATE_LIMIT_USER}:${userId}`;
}

/**
 * Performs rate limiting check using Redis
 *
 * Uses a sliding window counter algorithm.
 * Returns true if rate limit is exceeded, false otherwise.
 * Fails open (returns false) if Redis error occurs.
 *
 * @param key - Redis key for rate limiting
 * @param config - Rate limit configuration (maxRequests, windowMs)
 * @returns Promise resolving to true if rate limit exceeded, false otherwise
 */
async function performRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<boolean> {
  try {
    const windowSeconds = Math.ceil(config.windowMs / 1000);
    const redisKey = `${key}:${windowSeconds}`;
    const current = await redis.get<number>(redisKey);

    if (current === null) {
      await redis.setex(redisKey, windowSeconds, 1);
      return false;
    }

    if (current >= config.maxRequests) {
      return true;
    }

    await redis.incr(redisKey);
    if (current === 1) {
      await redis.expire(redisKey, windowSeconds);
    }

    return false;
  } catch (error) {
    // Log error with context
    logError(error, {
      context: "rate-limit",
      key,
      config: {
        maxRequests: config.maxRequests,
        windowMs: config.windowMs,
      },
    });

    // Send alert to Sentry in production
    if (env.NODE_ENV === "production") {
      captureMessage("Rate limiting disabled due to Redis error", "error", {
        tags: {
          component: "rate-limit",
          severity: "high",
        },
        extra: {
          key,
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }

    // Fail open - allow request to proceed if Redis is down
    // This prevents Redis outages from breaking the entire application
    logWarning("Rate limiting disabled - Redis unavailable, failing open");
    return false;
  }
}

/**
 * Rate limits requests by IP address and user agent
 *
 * Uses Redis to track request counts per client identifier.
 * Returns a 429 response if rate limit is exceeded.
 *
 * @param request - Next.js request object
 * @param config - Rate limit configuration (maxRequests, windowMs, message)
 * @returns NextResponse with 429 status if rate limited, null otherwise
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const identifier = getClientIdentifier(request);
  const key = `${REDIS_PREFIXES.RATE_LIMIT}:${identifier}`;
  const exceeded = await performRateLimit(key, config);

  if (exceeded) {
    return NextResponse.json(
      { error: config.message || "Too many requests, please try again later" },
      { status: 429 }
    );
  }

  return null;
}

/**
 * Rate limits requests by user ID
 *
 * Uses Redis to track request counts per user.
 * Returns a 429 response if rate limit is exceeded.
 *
 * @param userId - User identifier
 * @param config - Rate limit configuration (maxRequests, windowMs, message)
 * @returns NextResponse with 429 status if rate limited, null otherwise
 */
export async function rateLimitByUser(
  userId: string,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const key = getUserIdentifier(userId);
  const exceeded = await performRateLimit(key, config);

  if (exceeded) {
    return NextResponse.json(
      { error: config.message || "Too many requests, please try again later" },
      { status: 429 }
    );
  }

  return null;
}

/**
 * Predefined rate limit configurations for common use cases
 *
 * - STRICT: 10 requests per minute
 * - MODERATE: 30 requests per minute
 * - RELAXED: 100 requests per minute
 * - API_STRICT: 60 requests per minute (for API endpoints)
 * - API_MODERATE: 200 requests per minute (for API endpoints)
 */
export const RATE_LIMIT_CONFIGS = {
  STRICT: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    message: "Too many requests. Please try again in a minute.",
  },
  MODERATE: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    message: "Too many requests. Please try again in a minute.",
  },
  RELAXED: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: "Too many requests. Please try again in a minute.",
  },
  API_STRICT: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    message: "API rate limit exceeded. Please try again later.",
  },
  API_MODERATE: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 1 minute
    message: "API rate limit exceeded. Please try again later.",
  },
} as const;
