import { Types } from "mongoose";
import type { IHUser } from "../../DB/Models/user.model.js";
import chatRepo from "../../Repo/chat.repo.js";
import { NotFound } from "../../Common/Exeptions/domain.error.js";
import { ChatTypeEnum } from "../../enums/chat.enum.js";

class ChatService {
  private _chatRepo = chatRepo;
  async getChat(participantId: string, user: IHUser) {
    const chat = await this._chatRepo.findOne({
      filter: {
        participants: {
          $all: [user._id, Types.ObjectId.createFromHexString(participantId)],
        },
        type: ChatTypeEnum.OVO,
      },
      options: {
        populate: [{ path: "paricipants" }],
      },
    });
    if (!chat) {
      throw new NotFound("Chat Not Found");
    }
    return chat;
  }
  async sendMessage(bodyData: any, user: IHUser) {
    const { content, sendTo } = bodyData;
    const chat = await this._chatRepo.findOneAndUpdate({
      filter: {
        participants: {
          $all: [user._id, Types.ObjectId.createFromHexString(sendTo)],
        },
        type: ChatTypeEnum.OVO,
      },
      update: {
        $push: {
          message: {
            content,
            createdBy: user._id,
          },
        },
      },
    });
    if (!chat) {
      await this._chatRepo.create({
        data: {
          participants: [user._id, Types.ObjectId.createFromHexString(sendTo)],
          message: [
            {
              content,
              createdBy: user._id,
            },
          ],
          createdBy: user._id,
          type: ChatTypeEnum.OVO,
        },
      });
    }
  }
  async getGroupChat(groupId: string, user: IHUser) {
    const chat = await this._chatRepo.findOne({
      filter: {
        _id: groupId,
        participants: {
          $all: [user._id],
        },
        type: ChatTypeEnum.OVM,
      },
      options: {
        populate: [{ path: "paricipants" }],
      },
    });
    if (!chat) {
      throw new NotFound("Group Chat Not Found");
    }
    return chat;
  }
  async sendGroupMessage(bodyData: any, user: IHUser) {
    const { content, groupId } = bodyData;
    const chat = await this._chatRepo.findOneAndUpdate({
      filter: {
        _id: groupId,
        participants: {
          $all: [user._id],
        },
        type: ChatTypeEnum.OVM,
      },
      update: {
        $push: {
          message: {
            content,
            createdBy: user._id,
          },
        },
      },
    });
    if (!chat) {
      throw new NotFound("Group Chat Not Found");
    }
  }
}

export default new ChatService();
