/**
 * Server error interfaces
 *
 * Interfaces for API error handling and responses.
 */

import type { ErrorCode } from "@/models/enums/error-codes";

/**
 * Standardized API error interface
 */
export interface ApiError {
  code: ErrorCode;
  message: string;
  statusCode: number;
}
