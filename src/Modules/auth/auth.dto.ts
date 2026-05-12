import type z from "zod";
import type {
  confirmEmailSchema,
  loginSchema,
  resendConfirmEmailOtpSchema,
  resendForgetPasswordOTPSchema,
  resetPasswordSchema,
  sendForgetPasswordOTPSchema,
  signupSchema,
  verifyForgetPasswordOTPSchema,
} from "./auth.validation.js";

export type LoginDto = z.infer<typeof loginSchema.body>;

export type SignupDto = z.infer<typeof signupSchema.body>;

export type confirmEmailDto = z.infer<typeof confirmEmailSchema.body>;

export type resendConfirmEmailOtpDto = z.infer<
  typeof resendConfirmEmailOtpSchema.body
>;

export type SendForgetPasswordOTPDto = z.infer<
  typeof sendForgetPasswordOTPSchema.body
>;

export type ResendForgetPasswordOTPDto = z.infer<
  typeof resendForgetPasswordOTPSchema.body
>;

export type VerifyForgetPasswordOTPDto = z.infer<
  typeof verifyForgetPasswordOTPSchema.body
>;

export type ResetPasswordDto = z.infer<
  typeof resetPasswordSchema.body
>;
