import { validationRealtime } from "../../../Middleware/validation.middleware.js";
import type { Server, ServerOptions, SocketAuthType } from "socket.io";
import { testSchema } from "../chat.validation.js";
import chatService from "../chat.service.js";
import redisService from "../../../DB/Redis/redis.service.js";

class ChatEvent {
  private _chatService = chatService;
  private _redisService = redisService;

  getChatEvent(socket: SocketAuthType) {
    socket.on("getChat", async (args) => {
      console.log(args);

      validationRealtime(testSchema, args);
    });
  }
  sendMessageEvent(socket: SocketAuthType, io: Server) {
    socket.on("sendMessage", async (args) => {
      console.log(args);

      await this._chatService.sendMessage(args, socket.data.user);

      const socketIds = await this._redisService.getMemberSocketIoIds(
        socket.data.user._id,
      );

      io.to(socketIds).emit("successMessage", args);

      const socketIdsAnotherUser =
        await this._redisService.getMemberSocketIoIds(args.sendTo);

      if (socketIdsAnotherUser.length) {
        io.to(socketIdsAnotherUser).emit("newMessage", {
          content: args.content,
          from: socket.data.user,
        });
      }
    });
  }
  sendGroupMessageEvent(socket: SocketAuthType, io: Server) {
    socket.on("sendGroupMessage", async (args) => {
      console.log(args);

      await this._chatService.sendGroupMessage(args, socket.data.user);

      const socketIds = await this._redisService.getMemberSocketIoIds(
        socket.data.user._id,
      );

      io.to(socketIds).emit("successMessage", {
        content: args.content,
        sendTo: args.groupId,
      });
    });
  }
}

export default new ChatEvent();
