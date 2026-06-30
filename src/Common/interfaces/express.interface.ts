import type { JwtPayload } from "jsonwebtoken";
import type { IHUser } from "../../DB/Models/user.model.js";
import type { Socket } from "socket.io";



declare module "express-serve-static-core"{
    interface Request {
        user: IHUser,
        tokenPayload: JwtPayload
    }
}

declare module "socket.io" {
  interface SocketAuthType extends Socket {
    data: {
      user: IHUser;
      verifiedToken: JwtPayload;
    };
  }
}

