import { RoleEnum } from "../../../enums/user.enums.js";
import authorizationGraphQl from "../../../Middleware/authorization.middleware.js";
import { validationGQL } from "../../../Middleware/validation.middleware.js";
import userRepo from "../../../Repo/user.repo.js";
import type { ContextType } from "../../gql/type.gql.js";
import { getUserProfileValidation } from "./user.gql.validation.js";

class UserResolver {
  private _userRepo = userRepo;
  userprofile = async (
    parent: any,
    args: { userId: string },
    context: ContextType,
  ) => {
    authorizationGraphQl(context.user.role, [RoleEnum.User]);
    validationGQL<{ userId: string }>(getUserProfileValidation, args);
    console.log({ context });

    const user = await this._userRepo.findOne({
      filter: { _id: args.userId },
    });
    return user;
  };
}

export default new UserResolver();
