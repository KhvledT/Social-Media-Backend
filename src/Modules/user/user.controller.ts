import express from "express";
import { authentication } from "../../Middleware/authentication.middleware.js";
import type { ObjectId } from "mongoose";
import userService from "./user.service.js";
import success from "../../Common/Response/success.response.js";
import { validation } from "../../Middleware/validation.middleware.js";
import { logoutSchema } from "./user.validation.js";
import cloudFileUpload from "../../Common/multer/multer.config.js";
import { StorageApproachEnum } from "../../enums/multer.enum.js";
import chatRouter from "../chat/chat.controller.js";

const userRouter: express.Router = express.Router();

userRouter.use("/:userId/chat", chatRouter)

userRouter.get(
  "/",
  authentication(),
  async (req: express.Request, res: express.Response) => {
    const result = await userService.getUserData(req.user)
    success({
      res,
      result
    })
  },
);

userRouter.post(
  "/upload-profile-picture",
  authentication(),
  cloudFileUpload({}).single("profilePic"),
  (req: express.Request, res: express.Response) => {
    return success({
      res,
      result: req.file,
      message: "Profile picture uploaded successfully",
    });
  },
);

userRouter.post(
  "/logout",
  authentication(),
  validation(logoutSchema),
  async (req, res) => {
    const result = await userService.logout(
      req.user.id,
      req.tokenPayload,
      req.body.logoutOption,
    );

    return success({ res, result, message: "Logged out successfully" });
  },
);

export default userRouter;
