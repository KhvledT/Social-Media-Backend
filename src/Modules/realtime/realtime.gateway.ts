import { Server, type ExtendedError, type SocketAuthType } from "socket.io";
import { Server as httpServer } from "http";
import tokenService from "../../Common/security/token.js";
import chatGateway from "../chat/realtime/chat.gateway.js";
import { BadRequest } from "../../Common/Exeptions/domain.error.js";

class RealTimeGateway {
  private _tokenService = tokenService;
  private _chatGateway = chatGateway;

  authentication = async (
    socket: SocketAuthType,
    next: (err?: ExtendedError) => void,
  ) => {
    try {
      const { user, verifiedToken } = await this._tokenService.checkToken(
        socket.handshake.auth.authorization,
      );

      // ensure user is present (checkToken may return null user)
      if (!user) throw new BadRequest("User not found in token payload");

      socket.data = { user, verifiedToken };
      next();
    } catch (error) {
      next(error as ExtendedError); // socket.emit("connect_error", error);
    }
  };
  
  initializeIo(server: httpServer) {
    const io = new Server(server, { cors: { origin: "*" } });

    io.use(this.authentication);

    io.on("connection", async (socket: SocketAuthType) => {
      this._chatGateway.registerEvents(socket, io);
    });
  }
}

export default new RealTimeGateway();
