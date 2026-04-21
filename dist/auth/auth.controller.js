import express from "express";
import authService from "./auth.service.js";
import success from "../Common/Response/success.response.js";
import { BadRequest } from "../Common/Exeptions/domain.error.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { validation } from "../Middleware/validation.middleware.js";
const authRouter = express.Router();
authRouter.get("/", (req, res) => {
    res.json({ message: "Auth route" });
});
authRouter.post("/login", validation(loginSchema), async (req, res) => {
    const result = await authService.login(req.body);
    success({
        res,
        StatusCode: 200,
        result,
    });
});
authRouter.post("/signup", validation(signupSchema), async (req, res) => {
    const result = await authService.signup(req.body);
    success({
        res,
        StatusCode: 201,
        result,
    });
});
export default authRouter;
