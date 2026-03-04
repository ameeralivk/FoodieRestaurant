import { IUserAuthController } from "../interface/IUserAuthController";
import IUserAuthService from "../../../../../services/userAuthService/auth/interface/IUserAuthService";
import { Request, Response } from "express";
import HttpStatus from "../../../../../constants/htttpStatusCode";
import { AppError } from "../../../../../utils/Error";
import { MESSAGES } from "../../../../../constants/messages";
import {
  userloginSchema,
  userregisterSchema,
} from "../../../../../helpers/zodvalidation";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../../DI/types";
const refreshTokenMaxAge =
  Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

@injectable()
export class UserAuthController implements IUserAuthController {
  constructor(
    @inject(TYPES.UserAuthService) private _userAuthService: IUserAuthService
  ) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, password } = req.body;
      let parsed = userregisterSchema.safeParse(req.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((e) => e.message);
        throw new AppError(errorMessages.join(","), HttpStatus.NOT_FOUND);
      }
      let result = await this._userAuthService.register(name, email, password);
      if (!result.success) {
        throw new Error(result.message);
      }
      return res
        .status(HttpStatus.CREATED)
        .json({ success: true, message: MESSAGES.OTP_SENT_SUCCESS });
    } catch (error) {
      const err = error as Error;
      throw new AppError(err.message);
    }
  };

  verifyOtp = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const { email, otp } = req.body;
      const { success, message, data, accesstoken } =
        await this._userAuthService.verifyOtp(email, otp);
      if (success) {
        return res.status(HttpStatus.OK).json({ message, data, accesstoken });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.OTP_INCORRECT });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = userloginSchema.safeParse(req.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((e) => e.message);
        throw new AppError(errorMessages.join(","), HttpStatus.NOT_FOUND);
      }
      const { email, password } = parsed.data;

      const { user, token, refreshToken } = await this._userAuthService.login(
        email,
        password
      );

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      return res.json({ user, token });
    } catch (error) {
      const err = error as Error;
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || MESSAGES.SERVER_ERROR });
    }
  };

  googleAuth = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { token } = req.body;
      const { user, accesstoken, refreshToken } =
        await this._userAuthService.googleAuth(token);
      const data = {
        phone:user.phone,
        _id: user._id,
        role: "user",
        name: user.Name,
        email: user.Email,
        googleId: user.googleID,
        imageUrl: user.imageUrl,
      };

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });
      res.cookie("access_token", accesstoken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      return res.status(200).json({
        success: true,
        data,
        accesstoken,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Google auth failed" });
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
      let response = await this._userAuthService.createLink(email);
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
      let response = await this._userAuthService.updatePassword(
        token,
        newPassword,
        email
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
    } catch (error: any) {
      throw new AppError(error);
    }
  };

  resendOtp = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const { email } = req.body;
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (!email || !emailRegex.test(email)) {
        throw new AppError(
          "Email Format are not Correct",
          HttpStatus.BAD_REQUEST
        );
      }
      const { message, success } = await this._userAuthService.resendOtp(email);
      if (success) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: message,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: message,
        });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };
}
