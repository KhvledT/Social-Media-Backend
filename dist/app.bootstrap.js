import express from "express";
import authRouter from "./Modules/auth/auth.controller.js";
import globalErrorHandler from "./Middleware/globalErr.middleware.js";
import { SERVER_PORT } from "./config/config.service.js";
import { DB_Connection } from "./DB/dbconnection.js";
import { redisConnection } from "./DB/Redis/redis.connection.js";
import userRouter from "./Modules/user/user.controller.js";
async function bootstrap() {
    const app = express();
    DB_Connection();
    await redisConnection();
    app.use(express.json());
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/", (req, res, next) => {
        res.json({ message: "Welcome to the API" });
    });
    app.use(globalErrorHandler);
    app.listen(SERVER_PORT, () => {
        console.log(`Server is running on port ${SERVER_PORT}`);
    });
}
export default bootstrap;
