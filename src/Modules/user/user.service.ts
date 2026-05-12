import type { JwtPayload } from "jsonwebtoken";
import type { ObjectId } from "mongoose";
import userRepo from "../../Repo/user.repo.js";
import redisService from "../../DB/Redis/redis.service.js";

class UserService {
  private _userRepo = userRepo;
  private _redisService = redisService;
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
}

export default new UserService();
