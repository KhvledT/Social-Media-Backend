import DBRepo from "./db.repo.js";
import type { IComment } from "../DB/Models/comment.model.js";
import CommentModel from "../DB/Models/comment.model.js";

class CommentRepo extends DBRepo<IComment> {
  constructor() {
    super(CommentModel);
  }
}

export default new CommentRepo();
