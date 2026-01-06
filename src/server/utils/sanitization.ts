/**
 * Shared sanitization utilities for services
 *
 * Prevents XSS attacks and ensures data integrity.
 * All functions remove malicious patterns and enforce length limits.
 */

import {
  VALIDATION_LIMITS,
  XSS_REMOVAL_PATTERNS,
} from "@/models/constants/validation";

/**
 * Removes XSS patterns from a string
 *
 * @param input - String to sanitize
 * @returns Sanitized string with XSS patterns removed
 */
function removeXSS(input: string): string {
  let sanitized = input;
  XSS_REMOVAL_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });
  return sanitized;
}

/**
 * Normalizes an email address
 *
 * Trims whitespace and converts to lowercase.
 *
 * @param email - Email address to normalize
 * @returns Normalized email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Internal sanitization function for strings
 *
 * @param value - String to sanitize
 * @param maxLength - Maximum allowed length
 * @param allowHtml - Whether to allow HTML (default: false)
 * @returns Sanitized string or null if input is falsy
 */
const sanitizeString = (
  value: string | null | undefined,
  maxLength: number,
  allowHtml: boolean = false
): string | null => {
  if (!value) return null;

  let sanitized = value.trim();

  if (!allowHtml) {
    sanitized = removeXSS(sanitized);
  }

  return sanitized.substring(0, maxLength) || null;
};

/**
 * Sanitizes a name string
 *
 * Removes XSS patterns and enforces length limit.
 *
 * @param name - Name to sanitize
 * @returns Sanitized name or null if input is falsy
 */
export function sanitizeName(name: string | null | undefined): string | null {
  return sanitizeString(name, VALIDATION_LIMITS.NAME_MAX_LENGTH, false);
}

/**
 * Sanitizes an image URL string
 *
 * Removes XSS patterns and enforces length limit.
 *
 * @param imageUrl - Image URL to sanitize
 * @returns Sanitized image URL or null if input is falsy
 */
export function sanitizeImageUrl(
  imageUrl: string | null | undefined
): string | null {
  return sanitizeString(
    imageUrl,
    VALIDATION_LIMITS.IMAGE_URL_MAX_LENGTH,
    false
  );
}

/**
 * Sanitizes HTML content
 *
 * Removes XSS patterns from HTML strings.
 *
 * @param html - HTML content to sanitize
 * @returns Sanitized HTML or null if input is falsy
 */
export function sanitizeHtml(html: string | null | undefined): string | null {
  if (!html) return null;

  const sanitized = removeXSS(html);
  return sanitized.substring(0, VALIDATION_LIMITS.IMAGE_URL_MAX_LENGTH) || null;
}

/**
 * Sanitizes a text string with custom length limit
 *
 * Removes XSS patterns and enforces length limit.
 *
 * @param text - Text to sanitize
 * @param maxLength - Maximum allowed length (default: NAME_MAX_LENGTH)
 * @returns Sanitized text or null if input is falsy
 */
export function sanitizeText(
  text: string | null | undefined,
  maxLength: number = VALIDATION_LIMITS.NAME_MAX_LENGTH
): string | null {
  return sanitizeString(text, maxLength, false);
}
