import { commonValidationField } from "../../../Middleware/validation.middleware.js";
import { ReactTypeEnum } from "../../../enums/react.enum.js";
import { z } from "zod";

export const reactPostValidation = z.strictObject({
  postId: commonValidationField.id,
  react: z.nativeEnum(ReactTypeEnum),
});