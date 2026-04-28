import express from "express";
import { authentication } from "../../Middleware/authentication.middleware.js";

const userRouter: express.Router = express.Router();

userRouter.get("/", authentication(), (req: express.Request, res: express.Response) => {
  res.json({ message: "User route", user:req.user });
});

export default userRouter;
