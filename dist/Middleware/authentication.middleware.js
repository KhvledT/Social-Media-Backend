import { TokenTypeEnum } from "../enums/token.enum.js";
import { BadRequest, Unauthorized } from "../Common/Exeptions/domain.error.js";
import TokenServices from '../Common/security/token.js';
import redisService from "../DB/Redis/redis.service.js";
import UserRepo from "../Repo/user.repo.js";
export function authentication(tokenTypeParm = TokenTypeEnum.access) {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Unauthorized("you need to login first");
        }
        const [BearerKey, token] = authorization.split(" ");
        if (BearerKey != "Bearer") {
            throw new BadRequest("invalid bearer key");
        }
        if (!token) {
            throw new Unauthorized("you need to login first");
        }
        const decodedToken = TokenServices.decodeToken(token);
        if (!decodedToken || !decodedToken.aud) {
            throw new Unauthorized("invalid token payload");
        }
        const [userRole, tokenType] = decodedToken.aud;
        if (tokenType != tokenTypeParm) {
            throw new BadRequest("invalid token type");
        }
        const { accessSignature, refreshSignature } = TokenServices.getSignature(Number(userRole));
        const verifiedToken = TokenServices.verifyToken({
            token: token,
            signature: tokenTypeParm == TokenTypeEnum.access
                ? accessSignature
                : refreshSignature,
        });
        if (verifiedToken.jti &&
            (await redisService.exists(redisService.getBlackListTokenKey({
                userId: verifiedToken.sub,
                tokenId: verifiedToken.jti,
            })))) {
            throw new Unauthorized("You need to login again");
        }
        const user = await UserRepo.findById({
            id: verifiedToken.sub
        });
        if (!user) {
            throw new Unauthorized("account not found , signup again");
        }
        if (new Date(verifiedToken.iat * 1000) < user.changeCreditTime) {
            throw new Unauthorized("You need to login again");
        }
        req.user = user;
        req.tokenPayload = verifiedToken;
        next();
    };
}
