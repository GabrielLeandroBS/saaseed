import { z } from "@/lib/zod";

const MIN_PASSWORD_LENGTH = 6;

const AuthSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

const AuthSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  name: z.string().min(5),
  surname: z.string().min(5),
});

const AuthForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const AuthResetPasswordSchema = z
  .object({
    password: z.string().min(MIN_PASSWORD_LENGTH),
    confirmPassword: z.string().min(MIN_PASSWORD_LENGTH),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

type AuthForgotPasswordSchemaType = z.infer<typeof AuthForgotPasswordSchema>;
type AuthResetPasswordSchemaType = z.infer<typeof AuthResetPasswordSchema>;
type AuthSignInSchemaType = z.infer<typeof AuthSignInSchema>;
type AuthSignUpSchemaType = z.infer<typeof AuthSignUpSchema>;

export {
  AuthForgotPasswordSchema,
  type AuthForgotPasswordSchemaType,
  AuthResetPasswordSchema,
  type AuthResetPasswordSchemaType,
  AuthSignInSchema,
  type AuthSignInSchemaType,
  AuthSignUpSchema,
  type AuthSignUpSchemaType,
};
