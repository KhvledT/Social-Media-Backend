import { GraphQLError } from "graphql";
import { BadRequest, MapGQLError } from "../Common/Exeptions/domain.error.js";
import type { RoleEnum } from "../enums/user.enums.js";





function authorizationGraphQl(userRole: RoleEnum, endPointRoles: RoleEnum[]) {

    if (!endPointRoles.includes(userRole)) { 
        MapGQLError(new BadRequest("You are not authorized to access this endpoint"));
    }
}

export default authorizationGraphQl;