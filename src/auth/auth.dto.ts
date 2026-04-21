import type z from "zod";
import type { loginSchema, signupSchema } from "./auth.validation.js";

export type LoginDto = z.infer<typeof loginSchema.body>;

export type SignupDto = z.infer<typeof signupSchema.body>;
