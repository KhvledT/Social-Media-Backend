import DBRepo from "./db.repo.js";
import type { IChat } from "../DB/Models/chat.model.js";
import chatModel from "../DB/Models/chat.model.js";

class ChatRepo extends DBRepo<IChat> {
  constructor() {
    super(chatModel);
  }
}

export default new ChatRepo();
