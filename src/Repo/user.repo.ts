import type { IUser } from "../DB/Models/user.model.js";
import UserModel from "../DB/Models/user.model.js";
import DBRepo from "./db.repo.js";

class UserRepo extends DBRepo<IUser> {
    constructor(){
        super(UserModel);
    }
    public async checkUserExists(id: string): Promise<boolean> {
        return await this.findOne({ filter: { _id: id } }) !== null;
    }
}

export default UserRepo;