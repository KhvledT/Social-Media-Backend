import express from "express";
import { authentication } from "../../Middleware/authentication.middleware.js";
import cloudFileUpload from "../../Common/multer/multer.config.js";
import { validation } from "../../Middleware/validation.middleware.js";
import success from "../../Common/Response/success.response.js";
import commentService from "./comment.service.js";
import { createCommentSchema } from "./comment.validation.js";

const commentRouter: express.Router = express.Router();

commentRouter.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Comment router", user: req.user });
});

commentRouter.post(
  "/create-comment/:postId",
  authentication(),
  cloudFileUpload({}).array("createCommentImage", 5),
  validation(createCommentSchema, true),
  async (req: express.Request, res: express.Response) => {
    await commentService.createComment(
      req.body,
      req.user!,
      req.params?.postId as string,
      req.files as Express.Multer.File[],
    );
    success({ res, message: "Comment Created Successfully" });
  },
);
commentRouter.post(
  "/:postId/reply-comment/:commentId",
  authentication(),
  cloudFileUpload({}).array("createCommentImage", 5),
  validation(createCommentSchema, true),
  async (req: express.Request, res: express.Response) => {
    await commentService.replyComment(
      req.body,
      req.user!,
      req.params?.postId as string,
      req.params?.commentId as string,
      req.files as Express.Multer.File[],
    );
    success({ res, message: "Comment Created Successfully" });
  },
);
commentRouter.get(
  "/comment-details/:commentId",
  authentication(),
  // validation(createCommentSchema, true),
  async (req: express.Request, res: express.Response) => {
    const result = await commentService.commentDetails(
      req.params?.commentId as string,
      req.user!,
    );
    success({ res, message: "Comment Details Retrieved Successfully", result });
  },
);

export default commentRouter;
