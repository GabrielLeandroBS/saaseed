import { z } from "@/lib/zod";

const AuthSignInSchema = z.object({
  email: z.string().email(),
});

const AuthSignUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  surname: z.string().min(2),
});

type AuthSignInSchemaType = z.infer<typeof AuthSignInSchema>;
type AuthSignUpSchemaType = z.infer<typeof AuthSignUpSchema>;

export {
  AuthSignInSchema,
  type AuthSignInSchemaType,
  AuthSignUpSchema,
  type AuthSignUpSchemaType,
};
