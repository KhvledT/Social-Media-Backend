import express from "express";
import authService from "./auth.service.js";
import success from "../../Common/Response/success.response.js";
import { BadRequest } from "../../Common/Exeptions/domain.error.js";
import * as authValidation from "./auth.validation.js";
import { validation } from "../../Middleware/validation.middleware.js";
const authRouter = express.Router();
authRouter.get("/", (req, res) => {
    res.json({ message: "Auth route" });
});
authRouter.post("/login", validation(authValidation.loginSchema), async (req, res) => {
    const result = await authService.login(req.body);
    success({
        res,
        StatusCode: 200,
        result,
    });
});
authRouter.post("/signup", validation(authValidation.signupSchema), async (req, res) => {
    const result = await authService.signup(req.body);
    success({
        res,
        message: "Check your inbox",
        StatusCode: 201,
        result,
    });
});
authRouter.post("/confirm-email", validation(authValidation.confirmEmailSchema), async (req, res) => {
    const result = await authService.confirmEmail(req.body);
    success({
        res,
        message: "Your Email is Confirmed",
    });
});
authRouter.post("/resend-confirm-email", validation(authValidation.resendConfirmEmailOtpSchema), async (req, res) => {
    const result = await authService.resendConfirmEmailOtp(req.body.email);
    success({
        res,
        message: "Check your inbox",
    });
});
export default authRouter;
