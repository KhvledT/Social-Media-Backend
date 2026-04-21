import express from "express";
import authRouter from "./auth/auth.controller.js";
import globalErrorHandler from "./Middleware/globalErr.middleware.js";
import { SERVER_PORT } from "./config/config.service.js";
import { DB_Connection } from "./DB/dbconnection.js";

function bootstrap() {
  const app: express.Express = express();
  DB_Connection();
  app.use(express.json());
  app.use("/auth", authRouter);

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
