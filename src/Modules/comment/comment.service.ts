import type { Types } from "mongoose";
import NotificationService from "../../Common/Notification/Notification.service.js";
import redisService from "../../DB/Redis/redis.service.js";
import commentRepo from "../../Repo/comment.repo.js";
import postRepo from "../../Repo/post.repo.js";
import userRepo from "../../Repo/user.repo.js";
import { BadRequest, NotFound } from "../../Common/Exeptions/domain.error.js";
import { uploadSmallFileToCloudinary } from "../../Common/Cloudinary/cloudinary.service.js";
import type { IHUser } from "../../DB/Models/user.model.js";
import type { CreateCommentDto } from "./comment.dto.js";
import type { IPost } from "../../DB/Models/post.model.js";

class CommentService {
  private _commentRepo = commentRepo;
  private _userRepo = userRepo;
  private _redisService = redisService;
  private _notificationService = NotificationService;
  private _postRepo = postRepo;

  async createComment(
    bodyData: CreateCommentDto,
    user: IHUser,
    postId: Types.ObjectId | string,
    files?: Express.Multer.File[],
  ) {
    const { tags } = bodyData;

    const post = await this._postRepo.findOne({
      filter: {
        _id: postId,
        $or: this._postRepo.checkPostPrivacy(user),
      },
    });

    if (!post) {
      throw new NotFound("post not found");
    }

    const comment = this._commentRepo.getDBDoc(bodyData as any);

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

    if (tags?.length) {
      for (const tag of tags!) {
        const tokens = await this._redisService.getMemberFCMTokens(tag);

        if (tokens.length) {
          await this._notificationService.sendNotifications({
            tokens,
            data: {
              title: "Comment Tagged",
              body: JSON.stringify({
                Message: "you have been tagged on comment",
                commentId: comment._id,
              }),
            },
          });
        }
      }
    }

    if (files?.length) {
      const result = files.map(async (file) => {
        return await uploadSmallFileToCloudinary(file, "comments");
      });
      comment.attachments = result as unknown as string;
    }

    comment.createdBy = user._id as Types.ObjectId;
    comment.postId = postId as Types.ObjectId;

    return await this._commentRepo.saveDBDoc(comment);
  }

  async replyComment(
    bodyData: CreateCommentDto,
    user: IHUser,
    postId: Types.ObjectId | string,
    commentId: Types.ObjectId | string,
    files?: Express.Multer.File[],
  ) {
    const { tags } = bodyData;

    const parentComment = await this._commentRepo.findOne({
      filter: {
        _id: commentId,
        postId,
      },
      options: {
        populate: [
          {
            path: "postId",
            match: {
              $or: this._postRepo.checkPostPrivacy(user),
            },
          },
        ],
      },
    });

    if (!parentComment || !(parentComment.postId as IPost)) {
      throw new NotFound("comment not found");
    }

    const comment = this._commentRepo.getDBDoc(bodyData as any);

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

    if (tags?.length) {
      for (const tag of tags!) {
        const tokens = await this._redisService.getMemberFCMTokens(tag);

        if (tokens.length) {
          await this._notificationService.sendNotifications({
            tokens,
            data: {
              title: "Comment Tagged",
              body: JSON.stringify({
                Message: "you have been tagged on comment",
                commentId: comment._id,
              }),
            },
          });
        }
      }
    }

    if (files?.length) {
      const result = files.map(async (file) => {
        return await uploadSmallFileToCloudinary(file, "reply-comments");
      });
      comment.attachments = result as unknown as string;
    }

    comment.createdBy = user._id as Types.ObjectId;
    comment.postId = postId as Types.ObjectId;
    comment.commentId = commentId as Types.ObjectId;

    return await this._commentRepo.saveDBDoc(comment);
  }

  async commentDetails(commentId: Types.ObjectId | string, user: IHUser) {
    const comment = await this._commentRepo.findOne({
      filter: {
        _id: commentId,
      },
      options: {
        populate: [
          {
            path: "postId",
            match: {
              $or: this._postRepo.checkPostPrivacy(user),
            },
          },
          {
            path: "commentId",
          }
        ],
      },
    });

    if (!comment || !(comment.postId as IPost)) {
      throw new NotFound("comment not found");
    }

    return comment;
  }
}

export default new CommentService();
