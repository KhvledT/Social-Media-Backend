import { validationGQL } from "../../../Middleware/validation.middleware.js";
import type { ContextType } from "../../gql/type.gql.js";
import postService from "../post.service.js";
import { reactPostValidation } from "./post.gql.validation.js";

class PostResolver {
  private _postService = postService;
  reactPost = async (parent: any, args: any, context: ContextType) => {
    validationGQL(reactPostValidation, args);

    const result = await this._postService.likeOrDislikePost(
      context.user,
      args.postId,
      args.react,
    );
    return {
      _id: result._id,
      likes: result.likes,
    };
  };
}

export default new PostResolver();
