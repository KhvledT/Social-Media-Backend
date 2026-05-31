import type z from "zod";
import type { createPostSchema, getPostsSchema, updatePostSchema } from "./post.validation.js";

export type CreatePostDto = z.infer<typeof createPostSchema.body>;
export type GetPostsDto = z.infer<typeof getPostsSchema.query>;
export type UpdatePostDto = z.infer<typeof updatePostSchema.body>;
