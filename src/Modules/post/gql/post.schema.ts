import { reactPostArgs } from "./post.args.js";
import PostResolver from "./post.resolvers.js";
import { readPostType } from "./post.type.js";

class PostSchema {
  postMutation() {
    return {
      reactPost: {
        type: readPostType,
        args: reactPostArgs,
        resolve: PostResolver.reactPost,
      },
    };
  }
}

export default new PostSchema();
