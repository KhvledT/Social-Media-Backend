import type { EmailTypeEnum } from "../../enums/email.enum.js";
import { client } from "./redis.connection.js";
class RedisService {
  getBlackListTokenKey({
    userId,
    tokenId,
  }: {
    userId: string;
    tokenId: string;
  }) {
    return `blacklist_token::${userId}::${tokenId}`;
  }
  getOtbKey({ email, emailType }: { email: string; emailType: EmailTypeEnum }) {
    return `OTP::${email}::${emailType}`;
  }
  getOtpReqNoKey({
    email,
    emailType,
  }: {
    email: string;
    emailType: EmailTypeEnum;
  }) {
    return `OTP::${email}::${emailType}::NO`;
  }
  getOtpBlockedKey({
    email,
    emailType,
  }: {
    email: string;
    emailType: EmailTypeEnum;
  }) {
    return `OTP::${email}::${emailType}::Blocked
    `;
  }

  async set({
    key,
    value,
    exType = "EX",
    exValue = 60,
  }: {
    key: string;
    value: string | number;
    exType?: "EX" | "PX" | "EXAT" | "PXAT";
    exValue?: number;
  }) {
    return await client.set(key, value, {
      expiration: { type: exType, value: exValue },
    });
  }

  async incr(key: string) {
    return await client.incr(key);
  }

  async decr(key: string) {
    return await client.decr(key);
  }

//   async hSet({ key, field, value, exType = "EX", exValue = 60 }) {
//     return await client.hSetEx(key, field, value, {
//       expiration: { type: exType, value: exValue },
//     });
//   }

//   async hGet({ key, field }) {
//     return await client.hGetEx(key, field);
//   }

  async get(key: string) {
    return await client.get(key);
  }

  async mGet(key: string[]) {
    return await client.mGet(key);
  }

  async ttl(key: string) {
    return await client.ttl(key);
  }

  async exists(key: string) {
    return await client.exists(key);
  }

  async persist(key: string) {
    return await client.persist(key);
  }

  async expire(key: string, seconds: number) {
    return await client.expire(key, seconds);
  }

  async del(keys: string) {
    return await client.del(keys);
  }

  async update({ key, value }: { key: string; value: string | number }) {
    if (!(await this.exists(key))) {
      return 0;
    }

    await client.set(key, value);
    return 1;
  }
}

export default new RedisService();
