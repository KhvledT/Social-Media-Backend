import type z from "zod";
import type { confirmEmailSchema, loginSchema, resendConfirmEmailOtpSchema, signupSchema } from "./auth.validation.js";

export type LoginDto = z.infer<typeof loginSchema.body>;

export type SignupDto = z.infer<typeof signupSchema.body>;

export type confirmEmailDto = z.infer<typeof confirmEmailSchema.body>;

