import { JWT_SECRET_REFRESH_ADMIN, JWT_SECRET_ACCESS_USER, JWT_SECRET_ACCESS_ADMIN, JWT_SECRET_REFRESH_USER, } from "../../config/config.service.js";
import { TokenTypeEnum } from "../../enums/token.enum.js";
import { RoleEnum } from "../../enums/user.enums.js";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
class TokenService {
    getSignature(role = RoleEnum.User) {
        let accessSignature = "";
        let refreshSignature = "";
        switch (role) {
            case RoleEnum.User:
                accessSignature = JWT_SECRET_ACCESS_USER;
                refreshSignature = JWT_SECRET_REFRESH_USER;
                break;
            case RoleEnum.Admin:
                accessSignature = JWT_SECRET_ACCESS_ADMIN;
                refreshSignature = JWT_SECRET_REFRESH_ADMIN;
                break;
        }
        return { accessSignature, refreshSignature };
    }
    generateToken({ payload = {}, signature, options = {}, }) {
        return jwt.sign(payload, signature, options);
    }
    verifyToken({ token, signature }) {
        return jwt.verify(token, signature);
    }
    decodeToken(token) {
        return jwt.decode(token);
    }
    generateAccessAndRefreshToken(user) {
        const { accessSignature, refreshSignature } = this.getSignature(Number(user.role));
        const tokenId = randomUUID();
        const access_Token = this.generateToken({
            signature: accessSignature,
            options: {
                audience: [String(user.role), TokenTypeEnum.access],
                expiresIn: 60 * 15,
                subject: user._id.toString(),
                jwtid: tokenId,
            },
        });
        const refresh_Token = this.generateToken({
            signature: refreshSignature,
            options: {
                audience: [String(user.role), TokenTypeEnum.refresh],
                expiresIn: "1y",
                subject: user._id.toString(),
                jwtid: tokenId,
            },
        });
        return { access_Token, refresh_Token };
    }
}
export default new TokenService();
