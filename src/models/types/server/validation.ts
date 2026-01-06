/**
 * Validation types
 *
 * Types for request validation operations.
 */

import { NextResponse } from "next/server";

/**
 * Result type for validation operations
 *
 * @template T - Type of validated data
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

