import { MESSAGES } from "../../../constants/messages";
import { TYPES } from "../../../DI/types";
import { generateToken } from "../../../middleware/jwt";
import { IAdminAuthRepository } from "../../../Repositories/Admin/interface/IAdminRepositories";
import { IDecoded, IRefreshTokenHandler } from "./IHandler";
import {inject,injectable} from 'inversify'

@injectable()
export class SuperAdminRefreshHandler implements IRefreshTokenHandler {
  constructor(@inject(TYPES.AdminAuthRepository)
    private adminRepo: IAdminAuthRepository) {}

  async handle(decoded:IDecoded): Promise<string> {
    const superadmin = await this.adminRepo.findById(decoded.id);

    if (!superadmin) {
      throw { status: 404, message: MESSAGES.ADMIN_NOT_FOUND };
    }

    return generateToken(decoded.id, decoded.role);
  }
}