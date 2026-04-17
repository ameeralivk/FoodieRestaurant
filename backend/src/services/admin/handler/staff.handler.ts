import { MESSAGES } from "../../../constants/messages";
import { TYPES } from "../../../DI/types";
import { generateToken } from "../../../middleware/jwt";
import { IStaffRepository } from "../../../Repositories/staff/interface/IStaffRepository";
import { IDecoded, IRefreshTokenHandler } from "./IHandler";
import { inject, injectable } from "inversify";
@injectable()
export class StaffRefreshHandler implements IRefreshTokenHandler {
  constructor(
    @inject(TYPES.staffRepository)
    private staffRepo: IStaffRepository,
  ) {}

  async handle(decoded: IDecoded): Promise<string> {
    const staff = await this.staffRepo.findById(decoded.id);

    if (!staff) {
      throw { status: 404, message: MESSAGES.STAFF_NOT_FOUND };
    }

    if (staff.isBlocked) {
      throw { status: 403, message: MESSAGES.ACCOUNT_IS_BLOCKED };
    }

    return generateToken(decoded.id, decoded.role);
  }
}
