import { GraphQLError } from "graphql";
import CustomError from "./custom.error.js";

export function MapGQLError(err: CustomError) {
  throw new GraphQLError(err.message || "Internal Server Error", {
    extensions: {
      statusCode: err.StatusCode || 500,
      cause: err.cause,
      stack: err.stack,
    },
  });
}

export class BadRequest extends CustomError {
  constructor(message: string = "Bad Request", cause?: unknown) {
    super(message, 400, cause);
  }
}

export class Unauthorized extends CustomError {
  constructor(message: string = "Unauthorized", cause?: unknown) {
    super(message, 401, cause);
  }
}

export class NotFound extends CustomError {
  constructor(message: string = "Not Found", cause?: unknown) {
    super(message, 404, cause);
  }
}

export class Conflict extends CustomError {
  constructor(message: string = "Conflict", cause?: unknown) {
    super(message, 409, cause);
  }
}
