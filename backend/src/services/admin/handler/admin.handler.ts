import { MESSAGES } from "../../../constants/messages";
import { TYPES } from "../../../DI/types";
import { generateToken } from "../../../middleware/jwt";
import { IAdminAuthRepository } from "../../../Repositories/Admin/interface/IAdminRepositories";
import { IRefreshTokenHandler } from "./IHandler";
import { inject, injectable } from "inversify";

@injectable()
export class AdminRefreshHandler implements IRefreshTokenHandler {
  constructor(
    @inject(TYPES.AdminAuthRepository)
    private adminRepo: IAdminAuthRepository,
  ) {}

  async handle(decoded: any): Promise<string> {
    const admin = await this.adminRepo.findById(decoded.id);

    if (!admin) {
      throw { status: 404, message: MESSAGES.ADMIN_NOT_FOUND };
    }

    if (admin.isBlocked) {
      throw { status: 403, message: MESSAGES.ACCOUNT_IS_BLOCKED };
    }

    return generateToken(decoded.id, decoded.role);
  }
}
