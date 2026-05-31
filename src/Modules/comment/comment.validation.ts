import z from "zod";
import { Types } from "mongoose";
import { commonValidationField } from "../../Middleware/validation.middleware.js";

export const createCommentSchema = {
  body: z
    .strictObject({
      content: z.string().min(3).max(1000).optional(),
      tags: z.array(z.string()).optional(),
      commentId: commonValidationField.id.optional(),
      files: z.array(z.any()).optional(),
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

  params: z.object({
    postId: commonValidationField.id,
  }),
};
