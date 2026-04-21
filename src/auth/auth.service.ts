import { BadRequest, Conflict } from "../Common/Exeptions/domain.error.js";
import success from "../Common/Response/success.response.js";
import type { IHUser } from "../DB/Models/user.model.js";
import UserRepo from "../Repo/user.repo.js";
import type { LoginDto, SignupDto } from "./auth.dto.js";

class AuthService {
  private _userRepo = new UserRepo();

  public async login(body: LoginDto) : Promise<IHUser> {
    const { email, password } = body;

    const user = await this._userRepo.findOne({ filter: { email } });

    if (!user) {
      throw new BadRequest("User not found");
    }
    if (user.password !== password) {
      throw new Conflict("passwors or email is incorrect");
    }

    return user;
  } 

  public async signup(bodyData: SignupDto): Promise<IHUser> {
    const { email } = bodyData;

    const isEmailExists = await this._userRepo.findOne({ filter: { email } });

    if (isEmailExists) {
      throw new Conflict("User already exists");
    }

    const [user] = await this._userRepo.create({data: [bodyData]});

    return user!;
  }
}

export default new AuthService();