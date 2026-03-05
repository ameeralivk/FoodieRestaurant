import { NextFunction, Request, Response } from "express";
import IAdminAuthService from "../../../../services/admin/interface/IAdminAuthService";
import IAdminAuthController from "../interface/IAdminAuthController";
import { AppError } from "../../../../utils/Error";
import HttpStatus from "../../../../constants/htttpStatusCode";
import { loginSchema, registerSchema } from "../../../../helpers/zodvalidation";
import { MESSAGES } from "../../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../DI/types";
import { getS3PublicUrl } from "../../../../utils/s3-url.utils";

const refreshTokenMaxAge =
  Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;
@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService)
    private _adminauthService: IAdminAuthService,
  ) {}
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((e) => e.message);
        throw new AppError(errorMessages.join(","), HttpStatus.NOT_FOUND);
      }
      const { restaurantName, email, password, role } = parsed.data;
      const { message } = await this._adminauthService.register(
        restaurantName,
        email,
        password,
        role,
      );
      if (message.success) {
        return res.status(HttpStatus.OK).json({ message });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Failed to SentOtp" });
      }
    } catch (error) {
      return next(error);
    }
  };
  verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { email, otp } = req.body;
      const { success, message, data, accesstoken } =
        await this._adminauthService.verifyOtp(email, otp);
      if (success) {
        res.status(HttpStatus.OK).json({ message, data, accesstoken });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Failed to SentOtp" });
      }
    } catch (error) {
      next(error);
    }
  };
  resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { email } = req.body;
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (!email || !emailRegex.test(email)) {
        throw new AppError(
          "Email Format are not Correct",
          HttpStatus.BAD_REQUEST,
        );
      }
      const { message, success } =
        await this._adminauthService.resendOtp(email);
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
    } catch (error) {
      next(error);
    }
  };

  googleAuth = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { token } = req.body;
      const { mapedAdmin, accesstoken, refreshToken } =
        await this._adminauthService.googleAuth(token);
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
        data: mapedAdmin,
        accesstoken,
      });
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        throw {
          status: HttpStatus.UNAUTHORIZED,
          message: MESSAGES.NO_REFRESH_TOKEN_FOUND,
        };
      }

      const { newAccessToken } =
        await this._adminauthService.refreshToken(refreshToken);
      console.log(newAccessToken, "tocknfdlasfjdkasj");
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      res.status(HttpStatus.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || MESSAGES.NO_REFRESH_TOKEN_FOUND });
      console.error("Error while creating refreshToken.", err);
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((e) => e.message);
        throw new AppError(errorMessages.join(","), HttpStatus.NOT_FOUND);
      }
      const { email, password } = parsed.data;

      const { mapedAdmin, token, refreshToken } =
        await this._adminauthService.login(email, password);
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });
      return res.json({ admin: mapedAdmin, token });
    } catch (error) {
      const err = error as Error;
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || MESSAGES.SERVER_ERROR });
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
      let response = await this._adminauthService.createLink(email);
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
      let response = await this._adminauthService.updatePassword(
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
    } catch (error: any) {
      throw new AppError(error);
    }
  };

  registerRestaurant = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const {
        restaurantName,
        email,
        ownerName,
        contactNumber,
        restaurantAddress,
        openingTime,
        closingTime,
        latitude,
        longitude,
      } = req.body;

      const files = req.files as
        | {
            restaurantPhoto?: Express.Multer.File[];
            proofDocument?: Express.Multer.File[];
          }
        | undefined;
      const restaurantPhotoKey = files?.restaurantPhoto?.[0]?.key;
      const proofDocumentKey = files?.proofDocument?.[0]?.key;

      // Construct public URLs directly
      const restaurantPhoto = getS3PublicUrl(restaurantPhotoKey);
      const proofDocument = getS3PublicUrl(proofDocumentKey);
      await this._adminauthService.registerRestaurant({
        email,
        restaurantName,
        ownerName,
        contactNumber,
        restaurantAddress,
        openingTime,
        closingTime,
        latitude,
        longitude,
        restaurantPhoto,
        proofDocument,
      });
      return res.status(200).json({
        success: true,
        message: MESSAGES.RESTAURANT_REGISTER_COMPLETE,
      });
    } catch (error: any) {
      throw new AppError(error?.message || "Something went wrong");
    }
  };

  getStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const adminId = req.params.id as string;
      const responseStatus = await this._adminauthService.getStatus(adminId);
      return res.status(200).json({
        success: true,
        status: responseStatus,
      });
    } catch (error: any) {
      throw new AppError(error?.message || "Something went wrong");
    }
  };

  updateDoc = async (req: Request, res: Response): Promise<Response> => {
    try {
      const adminId = req.params.id as string;

      if (!adminId) {
        throw new AppError("Admin ID is required", HttpStatus.BAD_REQUEST);
      }
      const proofDocument = req.file;
      const bucketName = process.env.S3_BUCKET_NAME;
      const region = process.env.AWS_REGION || "ap-south-1";
      const Document = proofDocument
        ? `https://${bucketName}.s3.${region}.amazonaws.com/${proofDocument.key}`
        : undefined;
      const file = Document;
      if (!file) {
        throw new AppError("No document uploaded", HttpStatus.BAD_REQUEST);
      }
      const updatedAdmin = await this._adminauthService.updateDocument(
        adminId,
        file,
      );
      return res.status(200).json({
        success: true,
        message: "Document updated successfully",
        admin: updatedAdmin,
      });
    } catch (error: any) {
      throw new AppError(error?.message || "Something went wrong");
    }
  };
}
