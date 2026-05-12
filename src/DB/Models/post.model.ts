import { model, Schema, Types, type HydratedDocument } from "mongoose";
import { PostPrivacyEnum } from "../../enums/post.enum.js";

export interface IPost {
  content?: string;
  attachments?: string;

  likes?: Types.ObjectId[];
  tags?: Types.ObjectId[];

  privacy: PostPrivacyEnum;
  createdBy: Types.ObjectId;

  deletedAt: Date;
}

export type HIPost = HydratedDocument<IPost>;

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: function (this: IPost): boolean {
        return !this.attachments?.length;
      },
    },
    attachments: [String],

    likes: [{ type: Types.ObjectId, ref: "User" }],
    tags: [{ type: Types.ObjectId, ref: "User" }],

    privacy: {
      type: Number,
      enum: PostPrivacyEnum,
      default: PostPrivacyEnum.PUBLIC,
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

postSchema.pre(["findOne", "find"], function () {
  const query = this.getQuery();
  if (query?.paranoid == true) {
    this.setQuery({ ...query, deletedAt: { $exists: false } });
  }
});

const PostModel = model<IPost>("Post", postSchema);

export default PostModel;
