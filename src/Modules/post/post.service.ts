import type { Types } from "mongoose";
import type { CreatePostDto } from "./post.dto.js";
import userRepo from "../../Repo/user.repo.js";
import { BadRequest } from "../../Common/Exeptions/domain.error.js";
import redisService from "../../DB/Redis/redis.service.js";
import NotificationService from "../../Common/Notification/Notification.service.js";

class PostService {
  private _userRepo = userRepo;
  private _redisService = redisService;
  private _notificationService = NotificationService;
  
  async createPost(bodyData: CreatePostDto, userId: Types.ObjectId | string) {
    const { tags } = bodyData;

    if (tags?.length) {
      const mentionedUsers = await this._userRepo.find({
        filter: {
          _id: { $in: tags },
        },
      });
      if (tags.length != mentionedUsers?.length) {
        throw new BadRequest("failed to find some tagged users");
      }
    }

    for (const tag of tags!) {
      const tokens = await this._redisService.getMemberFCMTokens(tag);

      if (tokens.length) {
        await this._notificationService.sendNotifications({
          tokens,
          data: {
            title: "post tagged",
            body: "you have been tagged on post",
          },
        });
      }
    }
  }
}

export default new PostService();
