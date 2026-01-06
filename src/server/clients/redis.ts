import { Redis } from "@upstash/redis";
import { env } from "@/env";

/**
 * Redis client for Upstash
 *
 * Used for:
 * - Distributed caching across instances (RedisCache)
 * - Session storage (RedisSessionStore)
 * - Rate limiting (Redis Rate Limiter)
 * - Temporary data storage
 *
 * ⚠️ IMPORTANT: Only use this on the server-side!
 * Never expose Redis credentials to the client-side.
 *
 * @see https://docs.upstash.com/redis
 */
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});
