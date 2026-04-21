import dotenv from "dotenv";
import path from "path";

export const NODE_ENV = process.env.NODE_ENV || "dev";

dotenv.config({
  path: path.resolve("./.env.dev"),
});

export const DB_LOCAL = process.env.DB_LOCAL || "";
export const SERVER_PORT = +process.env.SERVER_PORT!;
export const SALT_ROUNDS = +process.env.SALT_ROUNDS!;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
export const JWT_SECRET_ACCESS_USER = process.env.JWT_SECRET_ACCESS_USER as string;
export const JWT_SECRET_ACCESS_ADMIN = process.env.JWT_SECRET_ACCESS_ADMIN as string;
export const JWT_SECRET_REFRESH_USER = process.env.JWT_SECRET_REFRESH_USER as string;
export const JWT_SECRET_REFRESH_ADMIN = process.env.JWT_SECRET_REFRESH_ADMIN as string;
export const NODEMAILER_USER = process.env.NODEMAILER_USER as string;
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS as string;
export const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID as string;
export const REDIS_URL = process.env.REDIS_URL as string;