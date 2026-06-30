import { Router } from "express";
import { authentication } from "../../Middleware/authentication.middleware.js";
import chatService from "./chat.service.js";
import success from "../../Common/Response/success.response.js";

const chatRouter = Router({ mergeParams: true });

// /user/:userId/chat
chatRouter.get("/", authentication(), async (req, res, next) => {
  const result = await chatService.getChat(
    req.params.userId as string,
    req.user,
  );
  success({
    res,
    result,
  });
});

chatRouter.get("/group/:groupId", authentication(), async (req, res, next) => {
  const result = await chatService.getGroupChat(
    req.params.groupId as string,
    req.user,
  );
  success({
    res,
    result,
  });
});

export default chatRouter;
