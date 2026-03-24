import { injectable, inject } from "inversify";
import { IUserService } from "../../../services/user/interface/IUserService";
import { IUserController } from "../interface/IUserController";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../utils/Error";
import HttpStatus from "../../../constants/htttpStatusCode";
import { Response, Request } from "express";
import { MESSAGES } from "../../../constants/messages";
@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.userService) private _userService: IUserService) {}

  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const search = (req.query.search as string) || "";
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const users = await this._userService.getAllUsers(search, page, limit);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.USER_FETCHED_SUCCESS,
        users,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  updateUserStatus = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      throw new AppError("isBlocked must be boolean", HttpStatus.BAD_REQUEST);
    }

    const user = await this._userService.updateUserStatus(
      userId as string,
      status
    );
    if (!user) {
      throw new AppError(MESSAGES.USER_FAILED_UPDATE_STATUS);
    }
    return res.status(HttpStatus.OK).json({
      success: true,
      message: status
        ? MESSAGES.USER_BLOCKED_SUCCESS
        : MESSAGES.USER_UNBLOCKED_SUCESS,
    });
  };

  getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;

      const user = await this._userService.getUserDetails(userId as string);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.userId;
      const { name, phone, email } = req.body;

      const result = await this._userService.updateProfile(
        userId as string,
        name,
        phone,
        email
      );

      if ("requiresEmailVerification" in result) {
        return res.status(200).json({
          success: true,
          message: MESSAGES.OTP_SENT_SUCCESS,
          requiresOtp: true,
        });
      }

      return res.json({
        success: true,
        message: MESSAGES.PROFILE_UPDATE_SUCCESS,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  verifyEmailOtp = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, otp } = req.body;

      const result = await this._userService.verifyEmailOtp(email, otp);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new AppError(error);
    }
  };

  updateImage = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.params;
      const file = req.file as Express.MulterS3.File;
      const profilePhotoKey = file?.location;
      const result = await this._userService.updateProfilePhoto(
        profilePhotoKey as string,
        userId as string
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.PROFILE_IMAGE_UPDATE_SUCCESS,
        imageUrl:result?.image||""
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  changePassword = async(req: Request, res: Response): Promise<Response> => {
    try {
      const {userId} = req.params
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError("All fields are required");
      }

      const result = await this._userService.changePassword(
        userId as string,
        currentPassword,
        newPassword
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error:any) {
      throw new AppError(error.message)
    }
  }
}
