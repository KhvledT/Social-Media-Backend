import express from "express";
import { authentication } from "../../Middleware/authentication.middleware.js";
import cloudFileUpload from "../../Common/multer/multer.config.js";
import { createPostSchema } from "./post.validation.js";
import { validation } from "../../Middleware/validation.middleware.js";

const postRouter: express.Router = express.Router();

postRouter.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Post router", user: req.user });
});

postRouter.post(
  "/create-post",
  authentication(),
  cloudFileUpload({}).array("createPostImage", 5),
  validation(createPostSchema, true),
  (req: express.Request, res: express.Response) => {
    res.json({ user: req.body, files: req.files });
  },
);

export default postRouter;
