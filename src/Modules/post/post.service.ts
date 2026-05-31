import type { Types } from "mongoose";
import type { CreatePostDto, GetPostsDto, UpdatePostDto } from "./post.dto.js";
import userRepo from "../../Repo/user.repo.js";
import { BadRequest, NotFound } from "../../Common/Exeptions/domain.error.js";
import redisService from "../../DB/Redis/redis.service.js";
import NotificationService from "../../Common/Notification/Notification.service.js";
import postRepo from "../../Repo/post.repo.js";
import { PostPrivacyEnum } from "../../enums/post.enum.js";
import type { IHUser } from "../../DB/Models/user.model.js";
import {
  deleteFileFromCloudinary,
  uploadSmallFileToCloudinary,
} from "../../Common/Cloudinary/cloudinary.service.js";
import { ReactTypeEnum } from "../../enums/react.enum.js";
import { populate } from "dotenv";

class PostService {
  private _userRepo = userRepo;
  private _redisService = redisService;
  private _notificationService = NotificationService;
  private _postRepo = postRepo;

  async createPost(
    bodyData: any,
    userId: Types.ObjectId | string,
    files?: Express.Multer.File[],
  ) {
    const { tags } = bodyData;

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

    const post = this._postRepo.getDBDoc(bodyData);

    if (files?.length) {
      const result = files.map(async (file) => {
        return await uploadSmallFileToCloudinary(file, "posts");
      });
      post.attachments = result as unknown as string;
    }

    if (tags?.length) {
      for (const tag of tags!) {
        const tokens = await this._redisService.getMemberFCMTokens(tag);

        if (tokens.length) {
          await this._notificationService.sendNotifications({
            tokens,
            data: {
              title: "post tagged",
              body: "you have been tagged on post",
            },
          });
        }
      }
    }

    post.createdBy = userId as Types.ObjectId;

    return await this._postRepo.saveDBDoc(post);
  }

  async getPosts(user: IHUser, queryData: GetPostsDto) {
    const searchQuery = queryData.search?.length
      ? {
          content: {
            $regex: queryData.search,
            $options: "i",
          },
        }
      : {};

    const posts = await this._postRepo.paginate({
      filter: {
        $or: this._postRepo.checkPostPrivacy(user),
        ...searchQuery,
      },
      page: +(queryData.page as number),
      limit: +(queryData.limit as number),
      options: {
        populate: [{ path: "comments", populate: { path: "commentId" } }],
      },
    });

    return posts;
  }

  async updatePost(
    bodyData: UpdatePostDto,
    postId: Types.ObjectId | string,
    userId: Types.ObjectId | string,
    files?: Express.Multer.File[],
  ) {
    const post = await this._postRepo.findOne({
      filter: { _id: postId, createdBy: userId },
    });

    if (!post) {
      throw new NotFound("post not found");
    }

    if (
      !post.content &&
      !bodyData.content &&
      !post.attachments &&
      !files?.length &&
      post.attachments?.length == bodyData.removeFiles?.length
    ) {
      throw new BadRequest("post content cannot be empty");
    }

    const { tags } = bodyData;

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

    let uploadedFiles: string[] = [];

    if (files?.length) {
      const result = files.map(async (file) => {
        return await uploadSmallFileToCloudinary(file, "posts");
      });
      uploadedFiles = result as unknown as string[];
    }

    for (const tag of tags!) {
      const tokens = await this._redisService.getMemberFCMTokens(tag);

      if (tokens.length) {
        await this._notificationService.sendNotifications({
          tokens,
          data: {
            title: "post tagged",
            body: "you have been tagged on post",
          },
        });
      }
    }

    if (bodyData.removeFiles?.length) {
      for (const fileUrl of bodyData.removeFiles) {
        const publicId = fileUrl.split("/").slice(-1)[0]!.split(".")[0];
        await deleteFileFromCloudinary(`posts/${publicId}`);
      }
    }

    await this._postRepo.findOneAndUpdate({
      filter: { _id: postId, createdBy: userId },
      update: [
        {
          $set: {
            content: bodyData.content || post.content,
            privacy: bodyData.privacy || post.privacy,
            tags: {
              $setUnion: [
                {
                  $setDifference: ["$tags", bodyData.removeTags || []],
                },
                bodyData.tags || [],
              ],
            },
            attachments: {
              $setUnion: [
                {
                  $setDifference: ["$attachments", bodyData.removeFiles || []],
                },
                uploadedFiles || [],
              ],
            },
          },
        },
      ],
      options: {
        updatePipeline: true,
        returnDocument: "after",
      },
    });
  }

  async likeOrDislikePost(
    user: IHUser,
    postId: Types.ObjectId | string,
    react: number | string,
  ) {
    const updateQuery =
      parseInt(react as string) == ReactTypeEnum.LIKE
        ? { $addToSet: { likes: user._id } }
        : { $pull: { likes: user._id } };

    const post = await this._postRepo.findOneAndUpdate({
      filter: {
        _id: postId,
        $or: this._postRepo.checkPostPrivacy(user),
      },

      update: updateQuery,

      options: { returnDocument: "after" },
    });

    if (!post) {
      throw new NotFound("Post Not Found");
    }

    return post;
  }
}

export default new PostService();
