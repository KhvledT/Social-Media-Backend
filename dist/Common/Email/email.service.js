import redisService from "../../DB/Redis/redis.service.js";
import { BadRequest } from "../Exeptions/domain.error.js";
import { generateOTP } from "../OTP/otp.service.js";
import { hashOperation } from "../security/hash.js";
import { sendMail } from "./email.config.js";
class MailService {
    _redisService = redisService;
    async sendEmailOtp({ email, emailType, subject, }) {
        const prevOtpTTL = await this._redisService.ttl(this._redisService.getOtbKey({ email, emailType }));
        if (prevOtpTTL > 0) {
            throw new BadRequest(`There is already OTP valid for ${prevOtpTTL} seconds`);
        }
        const isBlocked = await this._redisService.exists(this._redisService.getOtpBlockedKey({ email, emailType }));
        if (isBlocked) {
            throw new BadRequest("Try again later");
        }
        const reqNo = await this._redisService.get(this._redisService.getOtpReqNoKey({ email, emailType }));
        if (Number(reqNo) == 5) {
            await this._redisService.set({
                key: this._redisService.getOtpBlockedKey({
                    email,
                    emailType,
                }),
                value: 1,
                exValue: 10 * 60,
            });
            throw new BadRequest("you cannot request more than 5 emails in 20m");
        }
        const otp = generateOTP();
        await sendMail({
            email,
            otp,
            subject,
        });
        await this._redisService.set({
            key: this._redisService.getOtbKey({
                email,
                emailType,
            }),
            value: await hashOperation({ plainText: String(otp) }),
            exValue: 120,
        });
        await this._redisService.incr(this._redisService.getOtpReqNoKey({
            email,
            emailType,
        }));
    }
}
export default new MailService();
