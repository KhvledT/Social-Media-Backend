import { client } from "./redis.connection.js";
class RedisService {
    getBlackListTokenKey({ userId, tokenId, }) {
        return `blacklist_token::${userId}::${tokenId}`;
    }
    getOtbKey({ email, emailType }) {
        return `OTP::${email}::${emailType}`;
    }
    getOtpReqNoKey({ email, emailType, }) {
        return `OTP::${email}::${emailType}::NO`;
    }
    getOtpBlockedKey({ email, emailType, }) {
        return `OTP::${email}::${emailType}::Blocked
    `;
    }
    async set({ key, value, exType = "EX", exValue = 60, }) {
        return await client.set(key, value, {
            expiration: { type: exType, value: exValue },
        });
    }
    async incr(key) {
        return await client.incr(key);
    }
    async decr(key) {
        return await client.decr(key);
    }
    async get(key) {
        return await client.get(key);
    }
    async mGet(key) {
        return await client.mGet(key);
    }
    async ttl(key) {
        return await client.ttl(key);
    }
    async exists(key) {
        return await client.exists(key);
    }
    async persist(key) {
        return await client.persist(key);
    }
    async expire(key, seconds) {
        return await client.expire(key, seconds);
    }
    async del(keys) {
        return await client.del(keys);
    }
    async update({ key, value }) {
        if (!(await this.exists(key))) {
            return 0;
        }
        await client.set(key, value);
        return 1;
    }
}
export default new RedisService();
