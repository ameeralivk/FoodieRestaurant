import HttpStatus from "../../../constants/htttpStatusCode";
import { MESSAGES } from "../../../constants/messages";
import { IAdminAuthRepository } from "../../../Repositories/Admin/interface/IAdminRepositories";
import { generateOtp } from "../../../helpers/generateOtp";
import { AppError } from "../../../utils/Error";
import redisClient from "../../../config/redisClient";
import bcrypt from "bcrypt";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { sendResetPasswordEmail, sentOtp } from "../../../helpers/sentOtp";
import crypto from "crypto";
import { resendOtpEmail } from "../../../helpers/sentOtp";
import s3 from "../../../config/Bucket";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "../../../middleware/jwt";
import { IRestaurantRegisterData } from "../../../types/admin";
import IAdminAuthService from "../interface/IAdminAuthService";
import { AdminDTO, adminDTO } from "../../../utils/dto/adminDto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IUserRepository } from "../../../Repositories/user/interface/IUserRepository";
import { IStaffRepository } from "../../../Repositories/staff/interface/IStaffRepository";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.AdminAuthRepository)
    private _adminAuthRepository: IAdminAuthRepository,
    @inject(TYPES.userRepository)
    private _userRepo: IUserRepository,
    @inject(TYPES.staffRepository)
    private _staffRepository:IStaffRepository
  ) {}

  async register(
    restaurantName: string,
    email: string,
    password: string,
    role: string,
  ) {
    const existing = await this._adminAuthRepository.findByEmail(email);
    if (existing) {
      throw new AppError(MESSAGES.ADMIN_ALREADY_EXIST, HttpStatus.NOT_FOUND);
    }
    const redisDataKey = `adminData:${email}`;
    const redisOtpKey = `otp:${email}`;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const data = {
      restaurantName,
      email,
      password: hashedPassword,
      role,
    };
    const { hashedOtp, otp } = generateOtp();
    await redisClient.setEx(redisDataKey, 600, JSON.stringify(data));
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);
    let res = await sentOtp(email, otp);

    if (res.success) {
      return { success: true, message: res };
    } else {
      return { success: false, message: res };
    }
  }

  googleAuth = async (accessToken: string) => {
    const response = await axios.get(process.env.GOOGLE_USERINFO_URL!, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const { sub, email, picture } = response.data;
    let admin = await this._adminAuthRepository.findByEmail(email);
    if (admin?.isBlocked) {
      throw new AppError(MESSAGES.ADMIN_BLOCKED);
    }
    if (!admin) {
      const result = await this._adminAuthRepository.register({
        restaurantName: "",
        email,
        role: "admin",
        googleID: sub,
        imageUrl: picture,
      });

      admin = result.admin;
    }
    const accesstoken = generateToken(admin?._id as string, admin?.role);
    const refreshToken = generateRefreshToken(
      admin?._id as string,
      admin?.role,
    );
    const mapedAdmin = adminDTO(admin);
    return { mapedAdmin, accesstoken, refreshToken };
  };

  async verifyOtp(email: string, otp: string) {
    const redisOtpKey = `otp:${email}`;
    const redisDataKey = `adminData:${email}`;

    const hashedOtp = await redisClient.get(redisOtpKey);

    if (!hashedOtp) {
      throw new AppError("OTP expired or not found", HttpStatus.BAD_REQUEST);
    }

    const hashedInputOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    if (hashedInputOtp !== hashedOtp) {
      throw new AppError("Invalid OTP", HttpStatus.BAD_REQUEST);
    }
    const userDataString = await redisClient.get(redisDataKey);
    if (!userDataString) {
      throw new AppError(
        "Admin data expired or not found",
        HttpStatus.BAD_REQUEST,
      );
    }

    const userData = JSON.parse(userDataString);

    const createdUser = await this._adminAuthRepository.register(userData);

    await redisClient.del(redisOtpKey);
    await redisClient.del(redisDataKey);
    const accesstoken = generateToken(
      createdUser.admin._id as string,
      createdUser.admin?.role,
    );
    generateRefreshToken(
      createdUser.admin._id as string,
      createdUser.admin?.role,
    );
    return {
      success: true,
      message: MESSAGES.OTP_VERIFY_SUCCESS,
      data: createdUser,
      accesstoken,
    };
  }

  resendOtp = async (email: string) => {
    const { otp, hashedOtp } = generateOtp();

    const redisOtpKey = `otp:${email}`;
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);
    await resendOtpEmail(email, otp);

    return { success: true, message: MESSAGES.OTP_RESENT_SUCCESS };
  };


  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error(MESSAGES.NO_REFRESH_TOKEN_FOUND);
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw {
        status: HttpStatus.UNAUTHORIZED,
        message: MESSAGES.INVALID_TOKEN,
      };
    }
    if (decoded.role === "user") {
      const user = await this._userRepo.findById(decoded.id);

      if (!user) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: MESSAGES.USER_NOT_FOUND,
        };
      }

      if (user.isBlocked) {
        throw {
          status: HttpStatus.FORBIDDEN,
          message: MESSAGES.ACCOUNT_IS_BLOCKED,
        };
      }

      const newAccessToken = generateToken(decoded.id, decoded.role);
      return { newAccessToken };
    }
    if (decoded.role === "admin") {
      const admin = await this._adminAuthRepository.findById(decoded.id);

      if (!admin) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: MESSAGES.ADMIN_NOT_FOUND,
        };
      }

      if (admin.isBlocked) {
        throw {
          status: HttpStatus.FORBIDDEN,
          message: MESSAGES.ACCOUNT_IS_BLOCKED,
        };
      }

      const newAccessToken = generateToken(decoded.id, decoded.role);
      return { newAccessToken };
    }
    if (decoded.role === "chef") {
      const staff = await this._staffRepository.findById(decoded.id);
      if (!staff) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: MESSAGES.STAFF_NOT_FOUND,
        };
      }
      if (staff.isBlocked) {
        throw {
          status: HttpStatus.FORBIDDEN,
          message: MESSAGES.ACCOUNT_IS_BLOCKED,
        };
      }
      const newAccessToken = generateToken(decoded.id, decoded.role);
      return { newAccessToken };
    }
    if (decoded.role === "staff") {
      const staff = await this._staffRepository.findById(decoded.id);
      if (!staff) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: MESSAGES.STAFF_NOT_FOUND,
        };
      }
      if (staff.isBlocked) {
        throw {
          status: HttpStatus.FORBIDDEN,
          message: MESSAGES.ACCOUNT_IS_BLOCKED,
        };
      }
      const newAccessToken = generateToken(decoded.id, decoded.role);
      return { newAccessToken };
    }

    throw {
      status: HttpStatus.UNAUTHORIZED,
      message: MESSAGES.INVALID_TOKEN,
    };
  }

  createLink = async (
    email: string,
  ): Promise<{ success: boolean; message: string }> => {
    const admin = await this._adminAuthRepository.findByEmail(email);
    if (!admin) throw new Error(MESSAGES.ADMIN_NOT_FOUND);
    const token = crypto.randomBytes(32).toString("hex");
    await redisClient.setEx(`resetPassword:${email}`, 120, token);
    await sendResetPasswordEmail(email, token, "admin");
    return { success: true, message: "Password reset link sent to your email" };
  };

  async login(
    email: string,
    password: string,
  ): Promise<{ mapedAdmin: AdminDTO; token: string; refreshToken: string }> {
    const admin = await this._adminAuthRepository.findByEmail(email);
    if (admin?.isBlocked) {
      throw new AppError(MESSAGES.ADMIN_BLOCKED);
    }
    if (!admin) {
      throw new AppError(MESSAGES.ADMIN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", HttpStatus.UNAUTHORIZED);
    }

    const token = generateToken(admin._id as string, admin.role);
    const refreshToken = generateRefreshToken(admin._id as string, admin.role);
    const mapedAdmin = adminDTO(admin);
    return { mapedAdmin, token, refreshToken };
  }

  async updatePassword(
    token: string,
    newPassword: string,
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const storedToken = await redisClient.get(`resetPassword:${email}`);
      if (!storedToken || storedToken !== token) {
        return { success: false, message: "Invalid or expired token" };
      }
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      const admin = await this._adminAuthRepository.updatePasswordByEmail(
        email,
        hashedPassword,
      );
      if (!admin) {
        return { success: false, message: MESSAGES.ADMIN_NOT_FOUND };
      }
      await redisClient.del(`resetPassword:${email}`);

      return { success: true, message: MESSAGES.PASS_CHANGE_SUCCESS };
    } catch (error) {
      return { success: false, message:error instanceof Error ? error.message : "Internal Server Error" };
    }
  }

  async registerRestaurant(
    data: IRestaurantRegisterData,
  ): Promise<{ success: boolean; message: string }> {
    try {
      let res = await this._adminAuthRepository.findByEmail(data.email);
      if (!res) {
        throw new AppError(MESSAGES.ADMIN_NOT_FOUND);
      }
      const adminId = res?._id as string;
       await this._adminAuthRepository.registerRestaurent(
        adminId,
        data,
      );

      return { success: true, message: MESSAGES.RESTAURANT_REGISTER_COMPLETE };
    } catch (error: any) {
      throw new AppError(error);
    }
  }

  async getStatus(adminId: string) {
    const admin = await this._adminAuthRepository.findById(adminId);
    if (!admin) return null;

    const responseStatus: any = {
      status: admin.status,
      role: admin.role,
      isBlocked: admin.isBlocked,
      restaurantName: admin.restaurantName,
      email: admin.email,
    };

    if (admin.status === "rejected") {
      responseStatus.rejectionReason = admin.rejectionReason || "";
      responseStatus.rejectedAt = admin.rejectedAt || null;
    }

    return responseStatus;
  }

  async updateDocument(adminId: string, file: string) {
    const admin = await this._adminAuthRepository.findById(adminId);

    if (!admin) {
      throw new AppError("Admin not found", HttpStatus.NOT_FOUND);
    }

    const oldKey = admin.proofDocument;
    if (oldKey) {
      const bucketName = process.env.S3_BUCKET_NAME!;
      const region = process.env.AWS_REGION || "ap-south-1";

      // Extract the S3 object key from full URL
      const key = oldKey.replace(
        `https://${bucketName}.s3.${region}.amazonaws.com/`,
        "",
      );

      if (key) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          }),
        );
      }
    }
    await this._adminAuthRepository.updateById(adminId, {
      proofDocument: file,
      status: "resubmitted",
    });

    return { success: true, message: MESSAGES.DOC_IMAGE_UPDATED };
  }
}
