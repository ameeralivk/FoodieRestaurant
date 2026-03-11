import { inject, injectable } from "inversify";
import { IUserWalletService } from "../../../services/userWalletService/interface/IUserWalletService";
import { IUserWalletController } from "../interface/IUserWalletController";
import { TYPES } from "../../../DI/types";
import { Request, Response } from "express";
import { AppError } from "../../../utils/Error";
import HttpStatus from "../../../constants/htttpStatusCode";
import { MESSAGES } from "../../../constants/messages";
@injectable()
export class UserWalletController implements IUserWalletController {
  constructor(
    @inject(TYPES.userWalletService)
    private _userWalletService: IUserWalletService
  ) {}

  getWallet = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "UserId is required" });
      }
      const result = await this._userWalletService.getWallet(userId as string);
      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({
            success: true,
            message: MESSAGES.WALLET_FETCHED_SUCCESS,
            data: result.data,
          });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.WALLET_FETCHED_FAILED });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

   payWithWallet = async (req: Request, res: Response):Promise<Response> => {
    try {
      const { userId, amount, description } = req.body;
      const result = await this._userWalletService.payUsingWallet(userId, amount, description);
     return res.status(200).json(result);
    } catch (error: any) {
       throw new AppError(error.message)
    }
  };
}
