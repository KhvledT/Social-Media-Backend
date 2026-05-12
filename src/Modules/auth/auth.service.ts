import {
  BadRequest,
  Conflict,
  NotFound,
} from "../../Common/Exeptions/domain.error.js";
import { encrptValue } from "../../Common/security/encrypt.js";
import { compareOperation, hashOperation } from "../../Common/security/hash.js";
import Token from "../../Common/security/token.js";
import UserRepo from "../../Repo/user.repo.js";
import type {
  confirmEmailDto,
  LoginDto,
  resendConfirmEmailOtpDto,
  ResendForgetPasswordOTPDto,
  ResetPasswordDto,
  SendForgetPasswordOTPDto,
  SignupDto,
  VerifyForgetPasswordOTPDto,
} from "./auth.dto.js";
import MailService from "../../Common/Email/email.service.js";
import { EmailTypeEnum } from "../../enums/email.enum.js";
import redisService from "../../DB/Redis/redis.service.js";
import userRepo from "../../Repo/user.repo.js";
import { GOOGLE_CLIENT_ID } from "../../config/config.service.js";
import { OAuth2Client } from "google-auth-library";
import { ProviderEnum } from "../../enums/user.enums.js";
import type { IHUser } from "../../DB/Models/user.model.js";

class AuthService {
  private _userRepo = userRepo;
  private _TokenService = Token;
  private _mailService = MailService;
  private _redisService = redisService;

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

    await this._userRepo.create({ data: bodyData });
  }

  public async confirmEmail(bodyData: confirmEmailDto) {
    const { email, otp } = bodyData;
    const user = await this._userRepo.findOne({
      filter: { email, confirmEmail: false },
    });
    if (!user) {
      throw new BadRequest("Invalid email or email already confirmed");
    }
    const storedOtp = await this._redisService.get(
      this._redisService.getOtbKey({
        email,
        emailType: EmailTypeEnum.confirmEmail,
      }),
    );
    if (!storedOtp) {
      throw new BadRequest("OTP Expired");
    }
    const isOtpValid = await compareOperation({
      plainValue: otp,
      hashedValue: storedOtp,
    });
    if (!isOtpValid) {
      throw new BadRequest("OTP Not Valid");
    }
    user.confirmEmail = true;
    await user.save();
  }

  async resendConfirmEmailOtp({ email }: resendConfirmEmailOtpDto) {
    await this._mailService.sendEmailOtp({
      email,
      emailType: EmailTypeEnum.confirmEmail,
      subject: "Resend OTP - Confirm Your Email",
    });
  }

  async sendOTPForgetPassword({ email }: SendForgetPasswordOTPDto) {
    const user = await this._userRepo.findOne({
      filter: { email },
    });

    if (!user) {
      return;
    }

    if (!user.confirmEmail) {
      throw new BadRequest("Confirm your email first");
    }

    await this._mailService.sendEmailOtp({
      email,
      emailType: EmailTypeEnum.forgetPassword,
      subject: "Reset Your Password",
    });
  }

  async resendForgetPasswordOTP({ email }: ResendForgetPasswordOTPDto) {
    await this._mailService.sendEmailOtp({
      email,
      emailType: EmailTypeEnum.forgetPassword,
      subject: "Another OTP To Reset Your password",
    });
  }

  async verifyOTPForgetPassword(bodyData: VerifyForgetPasswordOTPDto) {
    const { email, otp } = bodyData;

    const emailOTP = await this._redisService.get(
      this._redisService.getOtbKey({
        email,
        emailType: EmailTypeEnum.forgetPassword,
      }),
    );

    if (!emailOTP) {
      throw new BadRequest("OTP Expired");
    }

    const isOtpValid = await compareOperation({
      plainValue: otp,
      hashedValue: emailOTP,
    });

    if (!isOtpValid) {
      throw new BadRequest("OTP Not Valid");
    }
  }

  async resetPassword(bodyData: ResetPasswordDto) {
    const { email, password, otp } = bodyData;

    await this.verifyOTPForgetPassword({ email, otp });

    await this._userRepo.updateOne({
      filter: { email },
      update: { password: await hashOperation({ plainText: password }) },
    });

    return;
  }

  async verifyGoogleToken(idToken: string) {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return payload;
  }

  async loginWithGoogle(idToken: string): Promise<{
    access_Token: string;
    refresh_Token: string;
  }> {
    const payload = await this.verifyGoogleToken(idToken);

    if (!payload) {
      throw new BadRequest("Invalid Google token");
    }

    if (!payload.email_verified) {
      throw new BadRequest("Email must be verified");
    }

    const user = await this._userRepo.findOne({
      filter: { email: payload.email as string, provider: ProviderEnum.Google },
    });

    // if (!user) {
    //   return this.signupWithGmail(idToken);
    // }

    return this._TokenService.generateAccessAndRefreshToken(user as IHUser);
  }

  async signupWithGmail(idToken: string): Promise<{
    status: number;
    result: {
      access_Token: string;
      refresh_Token: string;
    };
  }> {
    const payloadGoogleToken = await this.verifyGoogleToken(idToken);

    if (!payloadGoogleToken) {
      throw new BadRequest("Invalid token payload");
    }

    if (!payloadGoogleToken.email_verified) {
      throw new BadRequest("Email must be verified");
    }

    const user = await this._userRepo.findOne({
      filter: { email: payloadGoogleToken.email as string },
    });

    if (user) {
      if (user.provider == ProviderEnum.System) {
        throw new BadRequest(
          "Account already exists, login with your email and password",
        );
      }

      return { status: 200, result: await this.loginWithGoogle(idToken) }; // loginWithGoogle
    }

    const [newUser] = await this._userRepo.create({
      data: [
        {
          email: payloadGoogleToken.email,
          userName: payloadGoogleToken.name,
          profilePic: payloadGoogleToken.picture,
          confirmEmail: true,
          provider: ProviderEnum.Google,
        },
      ],
    });

    return {
      status: 201,
      result: this._TokenService.generateAccessAndRefreshToken(newUser!),
    };
  }
}

export default new AuthService();
