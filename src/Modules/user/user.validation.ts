import z from "zod";
import { commonValidationField } from "../../Middleware/validation.middleware.js";

export const logoutSchema = {
  body: z.strictObject({
    logoutOption: z.enum(["all", "one"], {
      message: "Invalid logout option",
    }),
  }),
};
