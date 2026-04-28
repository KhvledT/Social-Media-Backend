import { hash, compare } from "bcrypt";
import { SALT_ROUNDS } from "../../config/config.service.js";
export async function hashOperation({ plainText, rounds = SALT_ROUNDS, }) {
    return await hash(plainText, rounds);
}
export async function compareOperation({ plainValue, hashedValue, }) {
    return await compare(plainValue, hashedValue);
}
