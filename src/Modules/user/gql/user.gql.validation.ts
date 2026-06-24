import { commonValidationField } from "./../../../Middleware/validation.middleware.js";
import z from "zod";

export const getUserProfileValidation = z.strictObject({
  userId: commonValidationField.id,
});
