/**
 * Request body validation utilities
 *
 * Provides type-safe validation for API request bodies using Zod schemas.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { createApiError } from "./errors";
import { ErrorCode } from "@/models/enums/error-codes";
import type { ValidationResult } from "@/models/types/server/validation";

/**
 * Validates request body against a Zod schema
 *
 * Parses the request JSON and validates it against the provided schema.
 * Returns typed data on success or a NextResponse error on failure.
 *
 * @template T - Zod schema type
 * @param schema - Zod schema to validate against
 * @param request - Next.js request object
 * @returns Promise resolving to validation result with typed data or error response
 */
export async function validateRequestBody<T extends z.ZodTypeAny>(
  schema: T,
  request: NextRequest
): Promise<ValidationResult<z.infer<T>>> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((err) => {
        const path = err.path.join(".");
        return path ? `${path}: ${err.message}` : err.message;
      });
      const errorMessage =
        errors.length === 1
          ? errors[0]!
          : `Validation failed: ${errors.join(", ")}`;

      return {
        success: false,
        response: createApiError(ErrorCode.VALIDATION_ERROR, errorMessage),
      };
    }

    return { success: true, data: parsed.data };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        response: createApiError(ErrorCode.VALIDATION_ERROR, "Invalid JSON"),
      };
    }
    return {
      success: false,
      response: createApiError(
        ErrorCode.VALIDATION_ERROR,
        error instanceof Error ? error.message : "Unknown error"
      ),
    };
  }
}
