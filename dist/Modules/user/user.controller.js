import express from "express";
import { authentication } from "../../Middleware/authentication.middleware.js";
const userRouter = express.Router();
userRouter.get("/", authentication(), (req, res) => {
    res.json({ message: "User route", user: req.user });
});
export default userRouter;
