import type { Types } from "mongoose";
import PostModel, { type IPost } from "../DB/Models/post.model.js";
import type { IHUser } from "../DB/Models/user.model.js";
import { PostPrivacyEnum } from "../enums/post.enum.js";
import DBRepo from "./db.repo.js";

class PostRepo extends DBRepo<IPost> {
  constructor() {
    super(PostModel);
  }
  checkPostPrivacy(user: IHUser) {
    return [
      { privacy: PostPrivacyEnum.PUBLIC },
      { createdBy: { $in: [user._id] }, privacy: PostPrivacyEnum.FRIENDS },
      { tags: { $in: [user._id] } },
      { createdBy: user._id! },
    ];
  }
}

export default new PostRepo();
