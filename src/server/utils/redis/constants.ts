/**
 * Default TTL (Time To Live) for cached data
 * 5 minutes = 300 seconds
 */
export const DEFAULT_CACHE_TTL = 5 * 60;

/**
 * Redis key prefixes for namespacing
 */
export const REDIS_PREFIXES = {
  CACHE: "cache",
  RATE_LIMIT: "rate_limit",
  RATE_LIMIT_USER: "rate_limit:user",
  STRIPE_CUSTOMER: "stripe:customer",
} as const;
