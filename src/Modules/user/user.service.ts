import type { JwtPayload } from "jsonwebtoken";
import type { ObjectId } from "mongoose";
import userRepo from "../../Repo/user.repo.js";
import redisService from "../../DB/Redis/redis.service.js";
import type { IHUser } from "../../DB/Models/user.model.js";
import chatRepo from "../../Repo/chat.repo.js";
import { ChatTypeEnum } from "../../enums/chat.enum.js";

class UserService {
  private _userRepo = userRepo;
  private _redisService = redisService;
  private _chatRepo = chatRepo;
  async logout(
    userId: string | ObjectId,
    tokenData: JwtPayload,
    logoutOption: string,
  ) {
    if (logoutOption == "all") {
      await this._userRepo.updateOne({
        filter: { _id: userId },
        update: { changeCreditTime: new Date() },
      });
    } else {
      await this._redisService.set({
        key: this._redisService.getBlackListTokenKey({
          userId: userId as string,
          tokenId: tokenData.jti!,
        }),
        value: tokenData.jti as string,
        exValue:
          60 * 60 * 24 * 365 - (Math.floor(Date.now() / 1000) - tokenData.iat!),
      });
    }
  }
  async getUserData(user: IHUser) {
    await user.populate([
      {
        path: "friends",
      },
    ]);

    const groups = await this._chatRepo.find({
      filter: {
        participants: {
          $in: [user._id],
        },
        type: ChatTypeEnum.OVM,
      },
    });

    return {
      user,
      groups,
    };
  }
}

export default new UserService();
