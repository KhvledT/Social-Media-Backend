import type { NextFunction, Request, Response } from "express";
import { BadRequest } from "../Common/Exeptions/domain.error.js";
import { z, type ZodType } from "zod";
import { GenderEnum } from "../enums/user.enums.js";

type KeyReqType = keyof Request;

export function validation(Schema: Partial<Record<KeyReqType, ZodType>>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: { path: PropertyKey[]; message: string }[] = [];
    for (const key of Object.keys(Schema) as KeyReqType[]) {
      const result = Schema[key]!.safeParse(req[key]);

      if (!result.success) {
        validationErrors.push(
          ...result.error.issues.map((err) => {
            return {
              path: err.path,
              message: err.message,
            };
          }),
        );
      }
    }
    if (validationErrors.length > 0) {
      throw new BadRequest("Validation Error", validationErrors);
    }
    next();
  };
}

export const commonValidationField = {
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),

  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(15, "Password must be at most 15 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one letter and one number",
    ),

  confirmPassword: z
    .string()
    .min(6, "Confirm Password must be at least 6 characters long")
    .max(15, "Confirm Password must be at most 15 characters long"),

  age: z.number().int().positive("Age must be a positive integer"),
  gender: z.enum(GenderEnum),
  phone: z
    .string()
    .regex(
      new RegExp(/^(\+201|00201|01)(0|1|2|5)\d{8}$/),
      "Invalid phone number format",
    ),
};
