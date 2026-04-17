import { MESSAGES } from "../../../constants/messages";
import { TYPES } from "../../../DI/types";
import { generateToken } from "../../../middleware/jwt";
import { IUserRepository } from "../../../Repositories/user/interface/IUserRepository";
import IUserAuthRepository from "../../../Repositories/userAuth/auth/interface/IUserAuthRepository";
import { IDecoded, IRefreshTokenHandler } from "./IHandler";
import { inject, injectable } from "inversify"
@injectable()
export class UserRefreshHandler implements IRefreshTokenHandler {
  constructor(@inject(TYPES.userRepository)
    private userRepo: IUserRepository) {}

  async handle(decoded: IDecoded): Promise<string> {
    const user = await this.userRepo.findById(decoded.id);

    if (!user) {
      throw { status: 404, message: MESSAGES.USER_NOT_FOUND };
    }

    if (user.isBlocked) {
      throw { status: 403, message: MESSAGES.ACCOUNT_IS_BLOCKED };
    }

    return generateToken(decoded.id, decoded.role);
  }
}