import z from "zod";
import { PostPrivacyEnum } from "../../enums/post.enum.js";
import { Types } from "mongoose";
import { commonValidationField } from "../../Middleware/validation.middleware.js";

export const createPostSchema = {
  body: z
    .strictObject({
      content: z.string().min(3).max(1000).optional(),
      files: z.array(z.any()).optional(),
      tags: z.array(z.string()).optional(),
      privacy: z.coerce.number().default(PostPrivacyEnum.PUBLIC),
    })
    .superRefine((args, ctx) => {
      if (!args?.files?.length && !args.content) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "you should add content at least or upload one attachment",
        });
      }

      if (args.tags) {
        for (const tag of args.tags as string[]) {
          if (!Types.ObjectId.isValid(tag)) {
            ctx.addIssue({
              code: "custom",
              path: ["tags"],
              message: `Invalid Tag ID: ${tag}`,
            });
          }
        }

        const uniqueTags = [...new Set(args.tags)];
        if (uniqueTags.length != args.tags?.length) {
          ctx.addIssue({
            code: "custom",
            path: ["tags"],
            message: `Duplicate Tag IDs are not allowed`,
          });
        }
      }
    }),
};

export const getPostsSchema = {
  query: z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(3),
    search: z.string().optional(),
  }),
};

export const updatePostSchema = {
  body: z
    .strictObject({
      content: z.string().min(3).max(1000).optional(),
      tags: z.array(commonValidationField.id).optional(),
      removeTags: z.array(commonValidationField.id).optional(),
      files: z.array(z.any()).optional(),
      removeFiles: z.array(z.string()).optional(),
      privacy: z.coerce.number().optional(),
    })
    .superRefine((args, ctx) => {
      for (const tag of args.tags as string[]) {
        if (!Types.ObjectId.isValid(tag)) {
          ctx.addIssue({
            code: "custom",
            path: ["tags"],
            message: `Invalid Tag ID: ${tag}`,
          });
        }
      }

      const uniqueTags = [...new Set(args.tags)];
      if (uniqueTags.length != args.tags?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["tags"],
          message: `Duplicate Tag IDs are not allowed`,
        });
      }
    }),

  params: z.object({
    postId: commonValidationField.id,
  }),
};

export const reactPostSchema = {
  query: z.object({
    react: z.coerce.number(),
  }),
};
