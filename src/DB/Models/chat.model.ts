import { model, Schema, Types, type HydratedDocument } from "mongoose";
import { PostPrivacyEnum } from "../../enums/post.enum.js";
import { ChatTypeEnum } from "../../enums/chat.enum.js";

export interface IMessage {
  content?: string;
  attachments?: string;

  likes?: Types.ObjectId[];
  tags?: Types.ObjectId[];

  createdBy: Types.ObjectId;

  deletedAt: Date;
}

export interface IChat {
  participants?: Types.ObjectId[];

  message: IMessage[];
  type: ChatTypeEnum;

  // OVM group
  group: string;
  group_image: string;
  roomId: string;

  privacy: PostPrivacyEnum;
  createdBy: Types.ObjectId;

  deletedAt: Date;
}

export type HIChat = HydratedDocument<IChat>;

const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: function (this: IMessage): boolean {
        return !this.attachments?.length;
      },
    },
    attachments: [String],

    likes: [{ type: Types.ObjectId, ref: "User" }],
    tags: [{ type: Types.ObjectId, ref: "User" }],

    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const chatSchema = new Schema<IChat>(
  {
    participants: [{ type: Types.ObjectId, ref: "User", required: true }],

    message: { type: [messageSchema] },
    type: {type: String, enum: ChatTypeEnum , default: ChatTypeEnum.OVO},

    // OVM group
    group: {
      type: String,
      required: function (): boolean {
        return this.type == ChatTypeEnum.OVM;
      },
    },
    group_image: {
      type: String,
      required: function (): boolean {
        return this.type == ChatTypeEnum.OVM;
      },
    },
    roomId: {
      type: String,
      required: function (): boolean {
        return this.type == ChatTypeEnum.OVM;
      },
    },

    privacy: PostPrivacyEnum,
    createdBy: Types.ObjectId,

    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

chatSchema.pre(["findOne", "find", "countDocuments"], function () {
  const query = this.getQuery();
  if (query?.paranoid == true) {
    this.setQuery({ ...query, deletedAt: { $exists: false } });
  }
});

chatSchema.virtual("comments", {
  localField: "_id",
  foreignField: "postId",
  ref: "Comment",
  justOne: true,
});

const ChatModel = model<IChat>("Chat", chatSchema);

export default ChatModel;
