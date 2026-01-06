/**
 * Authentication schemas
 *
 * Zod schemas for validating authentication form data.
 */

import { z } from "@/lib/zod";

/**
 * Schema for sign-in form validation
 */
const AuthSignInSchema = z.object({
  email: z.string().email(),
});

/**
 * Schema for sign-up form validation
 */
const AuthSignUpSchema = z.object({
  email: z.string().email(),
});

/** Inferred type for sign-in schema */
type AuthSignInSchemaType = z.infer<typeof AuthSignInSchema>;

/** Inferred type for sign-up schema */
type AuthSignUpSchemaType = z.infer<typeof AuthSignUpSchema>;

export {
  AuthSignInSchema,
  type AuthSignInSchemaType,
  AuthSignUpSchema,
  type AuthSignUpSchemaType,
};
