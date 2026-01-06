import { redis } from "@/server/clients/redis";
import { DEFAULT_CACHE_TTL, REDIS_PREFIXES } from "./constants";
import { logError } from "@/server/utils/logger";

/**
 * Creates a Redis-based cache utility factory
 *
 * Provides distributed cache using Upstash Redis.
 * All cache operations use Redis (no in-memory cache).
 *
 * @template T - Type of data to cache
 * @param ttl - Time to live in seconds (default: 5 minutes)
 * @param prefix - Redis key prefix for namespacing (default: "cache")
 * @returns Cache object with get, set, delete, clear, has, and setWithTtl methods
 */
export function createRedisCache<T>(
  ttl: number = DEFAULT_CACHE_TTL,
  prefix: string = REDIS_PREFIXES.CACHE
) {
  /**
   * Generates a namespaced Redis key
   *
   * @param key - Cache key
   * @returns Full Redis key with prefix
   */
  function getKey(key: string): string {
    return `${prefix}:${key}`;
  }

  /**
   * Retrieves a value from Redis cache
   *
   * @param key - Cache key
   * @returns Promise resolving to the cached value or null if not found
   * @throws Error if Redis operation fails
   */
  async function get(key: string): Promise<T | null> {
    try {
      return await redis.get<T>(getKey(key));
    } catch (error) {
      logError(error, { context: "redis-cache", action: "get", key });
      throw error;
    }
  }

  /**
   * Stores a value in Redis cache with default TTL
   *
   * @param key - Cache key
   * @param data - Data to cache
   * @returns Promise that resolves when the value is stored
   * @throws Error if Redis operation fails
   */
  async function set(key: string, data: T): Promise<void> {
    try {
      await redis.setex(getKey(key), ttl, data);
    } catch (error) {
      logError(error, { context: "redis-cache", action: "set", key });
      throw error;
    }
  }

  /**
   * Deletes a value from Redis cache
   *
   * @param key - Cache key to delete
   * @returns Promise that resolves when the key is deleted
   * @throws Error if Redis operation fails
   */
  async function deleteKey(key: string): Promise<void> {
    try {
      await redis.del(getKey(key));
    } catch (error) {
      logError(error, { context: "redis-cache", action: "delete", key });
      throw error;
    }
  }

  /**
   * Clears all cached values matching the prefix
   *
   * @returns Promise that resolves when all matching keys are deleted
   * @throws Error if Redis operation fails
   */
  async function clear(): Promise<void> {
    try {
      const pattern = `${prefix}:*`;
      const keys = await redis.keys(pattern);
      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logError(error, { context: "redis-cache", action: "clear", prefix });
      throw error;
    }
  }

  /**
   * Checks if a key exists in Redis cache
   *
   * @param key - Cache key to check
   * @returns Promise resolving to true if key exists, false otherwise
   * @throws Error if Redis operation fails
   */
  async function has(key: string): Promise<boolean> {
    try {
      const exists = await redis.exists(getKey(key));
      return exists === 1;
    } catch (error) {
      logError(error, { context: "redis-cache", action: "has", key });
      throw error;
    }
  }

  /**
   * Stores a value in Redis cache with custom TTL
   *
   * @param key - Cache key
   * @param data - Data to cache
   * @param customTtl - Custom time to live in seconds
   * @returns Promise that resolves when the value is stored
   * @throws Error if Redis operation fails
   */
  async function setWithTtl(
    key: string,
    data: T,
    customTtl: number
  ): Promise<void> {
    try {
      await redis.setex(getKey(key), customTtl, data);
    } catch (error) {
      logError(error, {
        context: "redis-cache",
        action: "setWithTtl",
        key,
        customTtl,
      });
      throw error;
    }
  }

  return {
    get,
    set,
    delete: deleteKey,
    clear,
    has,
    setWithTtl,
  };
}
