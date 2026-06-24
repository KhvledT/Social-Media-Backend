import { GraphQLID, GraphQLNonNull } from "graphql";
import userResolvers from "./user.resolvers.js";
import { userProfileType } from "./user.type.js";
import { getUserProfileArgs } from "./user.args.js";

class UserSchama {
  userQueries() {
    return {
      getUserProfile: {
        type: userProfileType,
        args: getUserProfileArgs,
        resolve: userResolvers.userprofile,
        description: "get user profile",
      },
    };
  }
}

export default new UserSchama();
