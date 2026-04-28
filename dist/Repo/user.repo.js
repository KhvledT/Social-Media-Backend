import UserModel from "../DB/Models/user.model.js";
import DBRepo from "./db.repo.js";
class UserRepo extends DBRepo {
    constructor() {
        super(UserModel);
    }
    async checkUserExists(id) {
        return await this.findOne({ filter: { _id: id } }) !== null;
    }
}
export default new UserRepo();
