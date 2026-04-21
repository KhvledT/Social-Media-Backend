
import z from "zod";
import { commonValidationField } from "../Middleware/validation.middleware.js";

export const signupSchema = {
  body: z
    .strictObject({
      userName: commonValidationField.userName,

      email: commonValidationField.email,
      password: commonValidationField.password,

      confirmPassword: commonValidationField.confirmPassword,

      age: commonValidationField.age.optional(),
      gender: commonValidationField.gender.optional(),
      phone: commonValidationField.phone.optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
    }),
};

export const loginSchema = {
  body: z
    .strictObject({
      email: commonValidationField.email,
      password: commonValidationField.password,
    })
};
