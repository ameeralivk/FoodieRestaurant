import { MESSAGES } from "../../../../constants/messages";
import { TYPES } from "../../../../DI/types";
import { IRefreshTokenHandler } from "../IHandler";
import { inject, injectable } from "inversify";

@injectable()
export class RefreshTokenFactory {
  constructor(
    @inject(TYPES.UserRefreshHandler)
    private userHandler: IRefreshTokenHandler,

    @inject(TYPES.AdminRefreshHandler)
    private adminHandler: IRefreshTokenHandler,

    @inject(TYPES.SuperAdminRefreshHandler)
    private superAdminHandler: IRefreshTokenHandler,

    @inject(TYPES.StaffRefreshHandler)
    private staffHandler: IRefreshTokenHandler
  ) {}

  getHandler(role: string): IRefreshTokenHandler {
    switch (role) {
      case "user":
        return this.userHandler;

      case "admin":
        return this.adminHandler;

      case "superadmin":
        return this.superAdminHandler;

      case "chef":
      case "staff":
        return this.staffHandler;

      default:
        throw { status: 401, message: MESSAGES.INVALID_TOKEN };
    }
  }
}