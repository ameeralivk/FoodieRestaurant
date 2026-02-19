import { inject, injectable } from "inversify";
import { IStaffAuthService } from "../../../../services/staffAuthService/interface/IStaffAuthService";
import { IStaffAuthController } from "../interface/IStaffAuthController";
import { TYPES } from "../../../../DI/types";
import HttpStatus from "../../../../constants/htttpStatusCode";
import { Request,Response } from "express";



const refreshTokenMaxAge =
  Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;
@injectable()
export class StaffAuthController implements IStaffAuthController{
    constructor(@inject(TYPES.staffAuthService) private _staffAuthService:IStaffAuthService){}

   login = async(req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const result = await this._staffAuthService.login(email, password); 
     res.cookie("access_token", result.token.token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_token", result.token.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });
    return res.status(HttpStatus.OK).json({
      success: true,
      message: result.message,
      data:result.data
    });

  } catch (error: any) {
    return res.status(error.statusCode || HttpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};
}