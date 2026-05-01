import { inject, injectable } from "inversify";
import { IStaffAuthService } from "../../../../services/staffAuthService/interface/IStaffAuthService";
import { IStaffAuthController } from "../interface/IStaffAuthController";
import { TYPES } from "../../../../DI/types";
import HttpStatus from "../../../../constants/htttpStatusCode";
import { Request, Response } from "express";
import { MESSAGES } from "../../../../constants/messages";
import { AppError } from "../../../../utils/Error";

const refreshTokenMaxAge =
  Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

const accessTokenMaxAge =
  Number(process.env.ACCESS_TOKEN_MAX_AGE) || 15 * 60 * 1000;

  const isProduction = process.env.NODE_ENV === "production";
@injectable()
export class StaffAuthController implements IStaffAuthController {
  constructor(
    @inject(TYPES.staffAuthService)
    private _staffAuthService: IStaffAuthService,
  ) {}

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const result = await this._staffAuthService.login(email, password);
      // res.cookie("access_token", result.token.token, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: "strict",
      //   maxAge:accessTokenMaxAge,
      // });
      // res.cookie("refresh_token", result.token.refreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: "strict",
      //   maxAge: refreshTokenMaxAge,
      // });
      res.cookie("access_token", result.token.token, {
        httpOnly: true,
        secure: isProduction, // true in prod
        sameSite: isProduction ? "none" : "lax", // cross-site allowed in prod
        domain: isProduction ? "foodie.ameeralivk.buzz" : undefined, // matches prod domain
        maxAge: accessTokenMaxAge,
      });

      res.cookie("refresh_token", result.token.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        domain: isProduction ?  "foodie.ameeralivk.buzz" : undefined,
        maxAge: refreshTokenMaxAge,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      return res.status(error.statusCode || HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  };

  forgetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Email is required" });
      }
      let response = await this._staffAuthService.createLink(email);
      if (response.success) {
        return res
          .status(HttpStatus.CREATED)
          .json({ succes: true, message: MESSAGES.LINK_SENT_SUCCESS });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ succes: false, message: MESSAGES.LINK_SENT_FAILED });
      }
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Something went Wrong",
      });
    }
  };

  updatePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const token = req.query.token as string;
      const { newPassword, email } = req.body;
      if (!token) throw new AppError("Token is Missing");
      if (!newPassword)
        return res.status(400).json({ message: "New password is required" });
      let response = await this._staffAuthService.updatePassword(
        token,
        newPassword,
        email,
      );
      if (response.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: MESSAGES.PASS_CHANGE_SUCCESS });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: response.message });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };
}
