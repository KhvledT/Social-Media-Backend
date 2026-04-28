import {
  BadRequest,
  Conflict,
  NotFound,
} from "../../Common/Exeptions/domain.error.js";
import { encrptValue } from "../../Common/security/encrypt.js";
import { compareOperation, hashOperation } from "../../Common/security/hash.js";
import Token from "../../Common/security/token.js";
import UserRepo from "../../Repo/user.repo.js";
import type { confirmEmailDto, LoginDto,  SignupDto } from "./auth.dto.js";
import MailService from '../../Common/Email/email.service.js'
import { EmailTypeEnum } from "../../enums/email.enum.js";
import redisService from "../../DB/Redis/redis.service.js";
import userRepo from "../../Repo/user.repo.js";


class AuthService {
  private _userRepo = userRepo;
  private _TokenService = Token;
  private _mailService = MailService
  private _redisService = redisService

  public async login(bodyData: LoginDto): Promise<{
    access_Token: string;
    refresh_Token: string;
  }> {
    const { email, password } = bodyData;

    const user = await this._userRepo.findOne({
      filter: { email },
    });

    if (!user) {
      throw new NotFound("invalid info");
    }
    if (!user.confirmEmail) {
      throw new BadRequest("you need to confirm your email first");
    }

    const isPassword = await compareOperation({
      plainValue: password,
      hashedValue: user.password,
    });
    if (!isPassword) {
      throw new NotFound("password or email is incorrect");
    }
    return this._TokenService.generateAccessAndRefreshToken(user);
  }

  public async signup(bodyData: SignupDto) {
    const { email } = bodyData;

    const isEmailExists = await this._userRepo.findOne({ filter: { email } });

    if (isEmailExists) {
      throw new Conflict("User already exists");
    }
    bodyData.password = await hashOperation({ plainText: bodyData.password });

    if (bodyData.phone) {
      bodyData.phone = encrptValue({ value: bodyData.phone });
    }

    await this._mailService.sendEmailOtp({
      email,
      emailType: EmailTypeEnum.confirmEmail,
      subject:"Confirm Your Email"
    })

    await this._userRepo.create({ data: bodyData });
  }

  public async confirmEmail(bodyData: confirmEmailDto){
    const {email, otp} = bodyData;
    const user = await this._userRepo.findOne({
      filter:{ email, confirmEmail : false}
    })
    if (!user) {
      throw new BadRequest("Invalid email or email already confirmed")
    }
    const storedOtp = await this._redisService.get(
      this._redisService.getOtbKey({
        email,
        emailType: EmailTypeEnum.confirmEmail
      })
    )
    if (!storedOtp) {
      throw new BadRequest("OTP Expired")
    }
    const isOtpValid = await compareOperation({
      plainValue: otp,
      hashedValue: storedOtp
    });
    if (!isOtpValid) {
      throw new BadRequest("OTP Not Valid")
    }
    user.confirmEmail = true
    await user.save();
  }

  async resendConfirmEmailOtp(email:string){
    await this._mailService.sendEmailOtp({
      email,
      emailType: EmailTypeEnum.confirmEmail,
      subject: "Resend OTP - Confirm Your Email"
    })
  }
}

export default new AuthService();
