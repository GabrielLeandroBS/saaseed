/**
 * Redis interfaces
 *
 * Interfaces for Redis operations and configuration.
 */

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}
