/**
 * Shared validation utilities for services
 *
 * Provides type-safe validation functions with XSS protection.
 */

import { XSS_PATTERNS } from "@/models/constants/validation";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Checks if a string contains potential XSS patterns
 *
 * @param input - String to check
 * @returns True if XSS patterns are detected, false otherwise
 */
function containsXSS(input: string): boolean {
  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Validates if a value is a valid email address
 *
 * Checks format, length, and XSS patterns.
 *
 * @param email - Value to validate
 * @returns Type guard indicating if the value is a valid email string
 */
export function validateEmail(email: unknown): email is string {
  const isString = typeof email === "string";
  if (!isString) return false;

  const trimmed = email.trim();
  const hasMinLength = trimmed.length > 0;
  const hasAtSymbol = trimmed.includes("@");
  const matchesRegex = EMAIL_REGEX.test(trimmed);
  const noXSS = !containsXSS(trimmed);

  return hasMinLength && hasAtSymbol && matchesRegex && noXSS;
}

/**
 * Validates if a value is a valid string with length constraints
 *
 * @param value - Value to validate
 * @param minLength - Minimum string length (default: 1)
 * @param maxLength - Maximum string length (optional)
 * @returns Type guard indicating if the value is a valid string
 */
export function validateString(
  value: unknown,
  minLength: number = 1,
  maxLength?: number
): value is string {
  if (typeof value !== "string") return false;

  const trimmed = value.trim();
  const hasMinLength = trimmed.length >= minLength;
  const hasMaxLength = maxLength ? trimmed.length <= maxLength : true;
  const noXSS = !containsXSS(trimmed);

  return hasMinLength && hasMaxLength && noXSS;
}

/**
 * Validates if a value is a non-empty string
 *
 * Convenience function for validateString with minLength = 1.
 *
 * @param value - Value to validate
 * @returns Type guard indicating if the value is a non-empty string
 */
export function validateNonEmptyString(value: unknown): value is string {
  return validateString(value, 1);
}

/**
 * Validates if a value is safe HTML (no XSS patterns)
 *
 * @param html - Value to validate
 * @returns Type guard indicating if the value is safe HTML string
 */
export function validateSafeHtml(html: unknown): html is string {
  if (typeof html !== "string") return false;
  return !containsXSS(html);
}

/**
 * Validates if a value is a valid HTTP/HTTPS URL
 *
 * Checks URL format, protocol, and XSS patterns.
 *
 * @param url - Value to validate
 * @returns Type guard indicating if the value is a valid URL string
 */
export function validateUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;

  try {
    const parsed = new URL(url);
    const isValidProtocol = ["http:", "https:"].includes(parsed.protocol);
    const noXSS = !containsXSS(url);
    return isValidProtocol && noXSS;
  } catch {
    return false;
  }
}
