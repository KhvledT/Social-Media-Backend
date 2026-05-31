import express from "express";
import { authentication } from "../../Middleware/authentication.middleware.js";
import cloudFileUpload from "../../Common/multer/multer.config.js";
import {
  createPostSchema,
  getPostsSchema,
  reactPostSchema,
  updatePostSchema,
} from "./post.validation.js";
import { validation } from "../../Middleware/validation.middleware.js";
import postService from "./post.service.js";
import success from "../../Common/Response/success.response.js";

const postRouter: express.Router = express.Router();

postRouter.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Post router", user: req.user });
});

postRouter.post(
  "/create-post",
  authentication(),
  cloudFileUpload({}).array("createPostImage", 5),
  validation(createPostSchema, true),
  async (req: express.Request, res: express.Response) => {
    await postService.createPost(req.body, req.user!._id!);
    success({ res, message: "Post Created Successfully" });
  },
);

postRouter.get(
  "/get-posts",
  authentication(),
  validation(getPostsSchema),
  async (req: express.Request, res: express.Response) => {
    const posts = await postService.getPosts(req.user!, req.query! as any);
    success({ res, message: "Posts Retrieved Successfully", result: posts });
  },
);

postRouter.patch(
  "/update-post/:postId",
  authentication(),
  cloudFileUpload({}).array("updatePostImage", 5),
  validation(updatePostSchema, true),
  async (req: express.Request, res: express.Response) => {
    await postService.updatePost(
      req.body,
      req.params.postId as string,
      req.user!._id!,
      req.files as Express.Multer.File[],
    );
    success({ res, message: "Post Updated Successfully" });
  },
);

postRouter.post(
  "/react-post/:postId",
  authentication(),
  validation(reactPostSchema),
  async (req: express.Request, res: express.Response) => {   
    await postService.likeOrDislikePost(
      req.user!,
      req.params?.postId as string,
      req.query?.react as string,
    );
    success({ res, message: "Post Reacted Successfully" });
  },
);

export default postRouter;
