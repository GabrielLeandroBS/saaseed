import { NextResponse } from "next/server";
import { ErrorCode } from "@/models/enums/error-codes";
import type { ApiError } from "@/models/interfaces/server/errors";

export type { ApiError };

/**
 * Maps error codes to HTTP status codes
 */
const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.INVALID_EMAIL]: 400,
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.ALREADY_EXISTS]: 409,
  [ErrorCode.STRIPE_ERROR]: 502,
  [ErrorCode.SUPABASE_ERROR]: 502,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
  [ErrorCode.INVALID_CREDENTIALS]: 401,
};

/**
 * Creates a standardized API error response
 *
 * @param code - Error code from ErrorCode enum
 * @param message - Human-readable error message
 * @returns NextResponse with JSON error payload and appropriate status code
 */
export function createApiError(code: ErrorCode, message: string): NextResponse {
  const statusCode = ERROR_STATUS_MAP[code] || 500;

  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status: statusCode }
  );
}

/**
 * Converts an unknown error to a standardized ApiError
 *
 * Analyzes error message to determine appropriate error code.
 * Falls back to INTERNAL_ERROR if no pattern matches.
 *
 * @param error - Error to convert (can be Error, string, or unknown)
 * @returns Standardized ApiError object
 */
export function toApiError(error: unknown): ApiError {
  const errorObj = toError(error);
  const message = errorObj.message.toLowerCase();

  if (
    message.includes("unauthorized") ||
    message.includes("not authenticated")
  ) {
    return {
      code: ErrorCode.UNAUTHORIZED,
      message: errorObj.message,
      statusCode: 401,
    };
  }

  if (message.includes("not found") || message.includes("does not exist")) {
    return {
      code: ErrorCode.NOT_FOUND,
      message: errorObj.message,
      statusCode: 404,
    };
  }

  if (message.includes("already exists") || message.includes("duplicate")) {
    return {
      code: ErrorCode.ALREADY_EXISTS,
      message: errorObj.message,
      statusCode: 409,
    };
  }

  if (message.includes("stripe")) {
    return {
      code: ErrorCode.STRIPE_ERROR,
      message: errorObj.message,
      statusCode: 502,
    };
  }

  if (message.includes("supabase")) {
    return {
      code: ErrorCode.SUPABASE_ERROR,
      message: errorObj.message,
      statusCode: 502,
    };
  }

  if (message.includes("validation") || message.includes("invalid")) {
    return {
      code: ErrorCode.VALIDATION_ERROR,
      message: errorObj.message,
      statusCode: 400,
    };
  }

  return {
    code: ErrorCode.INTERNAL_ERROR,
    message: "Internal server error",
    statusCode: 500,
  };
}

/**
 * Converts an unknown value to an Error object
 *
 * @param error - Value to convert (can be Error or any value)
 * @returns Error object (original if already Error, new Error otherwise)
 */
export function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Unknown error");
}

/**
 * Creates a new Error with a custom message
 *
 * @param message - Error message
 * @returns New Error instance
 */
export function createError(message: string): Error {
  return new Error(message);
}
