import express from "express";
import authService from "./auth.service.js";
import success from "../../Common/Response/success.response.js";
import { BadRequest } from "../../Common/Exeptions/domain.error.js";
import * as authValidation from "./auth.validation.js";
import { validation } from "../../Middleware/validation.middleware.js";

const authRouter: express.Router = express.Router();

authRouter.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Auth route" });
});

authRouter.post(
  "/login",
  validation(authValidation.loginSchema),
  async (req: express.Request, res: express.Response) => {
    const result = await authService.login(req.body);
    success<{
      access_Token: string;
      refresh_Token: string;
    }>({
      res,
      StatusCode: 200,
      result,
    });
  },
);

authRouter.post(
  "/signup",
  validation(authValidation.signupSchema),
  async (req: express.Request, res: express.Response) => {
    const result = await authService.signup(req.body);
    success({
      res,
      message:"Check your inbox",
      StatusCode: 201,
      result,
    });
  },
);

authRouter.post(
  "/confirm-email",
  validation(authValidation.confirmEmailSchema),
  async (req: express.Request, res: express.Response) => {
    const result = await authService.confirmEmail(req.body);
    success({
      res,
      message:"Your Email is Confirmed",
    });
  },
);

authRouter.post(
  "/resend-confirm-email",
  validation(authValidation.resendConfirmEmailOtpSchema),
  async (req: express.Request, res: express.Response) => {
    await authService.resendConfirmEmailOtp({email: req.body.email});
    success({
      res,
      message:"Check your inbox",
    });
  },
);

authRouter.post(
  "/send-forget-password-otp",
  validation(authValidation.sendForgetPasswordOTPSchema),
  async (req: express.Request, res: express.Response) => {
    await authService.sendOTPForgetPassword({email: req.body.email});
    success({
      res,
      message:"Check your inbox",
    });
  },
);

authRouter.post(
  "/resend-forget-password-otp",
  validation(authValidation.resendForgetPasswordOTPSchema),
  async (req: express.Request, res: express.Response) => {
    await authService.resendForgetPasswordOTP({email: req.body.email});
    success({
      res,
      message:"Check your inbox",
    });
  },
);

authRouter.post(
  "/verify-forget-password-otp",
  validation(authValidation.verifyForgetPasswordOTPSchema),
  async (req: express.Request, res: express.Response) => {
    await authService.verifyOTPForgetPassword(req.body);
    success({
      res,
      message:"OTP Verified",
    });
  },
);

authRouter.post(
  "/reset-password",
  validation(authValidation.resetPasswordSchema),
  async (req: express.Request, res: express.Response) => {
    await authService.resetPassword(req.body);
    success({
      res,
      message:"Password Reset Successfully",
    });
  },
);
export default authRouter;
