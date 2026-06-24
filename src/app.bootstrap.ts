import express from "express";
import authRouter from "./Modules/auth/auth.controller.js";
import globalErrorHandler from "./Middleware/globalErr.middleware.js";
import { SERVER_PORT } from "./config/config.service.js";
import { DB_Connection } from "./DB/dbconnection.js";
import { redisConnection } from "./DB/Redis/redis.connection.js";
import userRouter from "./Modules/user/user.controller.js";
import postRouter from "./Modules/post/post.controller.js";
import commentRouter from "./Modules/comment/comment.controller.js";
import schema from "./Modules/gql/schame.gql.js";
import { createHandler } from "graphql-http/lib/use/express";
import { authentication } from "./Middleware/authentication.middleware.js";

async function bootstrap() {
  const app: express.Express = express();
  DB_Connection();
  await redisConnection();
  app.use(express.json());

  app.all(
    "/graphql",
    authentication(),
    createHandler({
      schema,
      context: (req) => ({
        user: req.raw.user,
        tokenPayload: req.raw.tokenPayload, 
      }),
    }),
  );
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);

  app.use(
    "/",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.json({ message: "Welcome to the API" });
    },
  );

  app.use(globalErrorHandler);

  app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
  });
}

export default bootstrap;
