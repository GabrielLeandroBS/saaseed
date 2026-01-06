/**
 * Validation constants
 */

export const VALIDATION_LIMITS = {
  NAME_MAX_LENGTH: 100,
  IMAGE_URL_MAX_LENGTH: 2048,
} as const;

/**
 * XSS detection patterns
 * Used for validation (detecting XSS)
 */
export const XSS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe/i,
  /<object/i,
  /<embed/i,
] as const;

/**
 * XSS removal patterns
 * Used for sanitization (removing XSS)
 */
export const XSS_REMOVAL_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
] as const;
