import PostModel, { type IPost } from "../DB/Models/post.model.js";
import DBRepo from "./db.repo.js";

class PostRepo extends DBRepo<IPost> {
  constructor() {
    super(PostModel);
  }
}

export default new PostRepo();