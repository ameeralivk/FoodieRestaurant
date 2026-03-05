import { MESSAGES } from "../../../../constants/messages";
import axios from "axios";
import IUserAuthService from "../interface/IUserAuthService";
import IUserAuthRepository from "../../../../Repositories/userAuth/auth/interface/IUserAuthRepository";
import bcrypt from "bcrypt";
import { generateOtp } from "../../../../helpers/generateOtp";
import { generateToken } from "../../../../middleware/jwt";
import crypto from "crypto";
import { generateRefreshToken } from "../../../../middleware/jwt";
import {
  resendOtpEmail,
  sendResetPasswordEmail,
  sentOtp,
} from "../../../../helpers/sentOtp";
import redisClient from "../../../../config/redisClient";
import HttpStatus from "../../../../constants/htttpStatusCode";
import { IUser } from "../../../../types/usert";
import { AppError } from "../../../../utils/Error";
import { mapUserToDto } from "../../../../utils/dto/userDto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../DI/types";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

@injectable()
export class UserAuthService implements IUserAuthService {
  constructor(
    @inject(TYPES.UserAuthRepository)
    private _userAuthRepository: IUserAuthRepository
  ) {}

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      let isExist = await this._userAuthRepository.findByEmail(email);
      if (isExist) {
        return { success: false, message: MESSAGES.USER_ALREADY_EXIST };
      }
      const redisDataKey = `userData:${email}`;
      const redisOtpKey = `otp:${email}`;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const data = {
        Name: name,
        Email: email,
        password: hashedPassword,
      };
      const { hashedOtp, otp } = generateOtp();
      await redisClient.setEx(redisDataKey, 600, JSON.stringify(data));
      await redisClient.setEx(redisOtpKey, 120, hashedOtp);
      await sentOtp(email, otp);
      return { success: true, message: MESSAGES.OTP_SENT_SUCCESS };
    } catch (error) {
      let err = error as Error;
      throw new Error(err.message);
    }
  }

  googleAuth = async (accessToken: string) => {
    const response = await axios.get(process.env.GOOGLE_USERINFO_URL!, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const { sub, name, email, picture } = response.data;
    let user = await this._userAuthRepository.findByEmail(email);
    if (!user) {
      const result = await this._userAuthRepository.googleregister({
        name: name,
        email: email,
        googleID: sub,
        imageUrl: picture,
      });

      user = result.user;
    }
    const accesstoken = generateToken(user?._id, "user");
    const refreshToken = generateRefreshToken(user?._id, "user");

    return { user, accesstoken, refreshToken };
  };

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; refreshToken: string }> {
    const user = await this._userAuthRepository.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.ADMIN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", HttpStatus.UNAUTHORIZED);
    }

    const token = generateToken(user._id, "user");
    const refreshToken = generateRefreshToken(user._id, "user");

    return { user, token, refreshToken };
  }

  async verifyOtp(email: string, otp: string) {
    const redisOtpKey = `otp:${email}`;
    const redisDataKey = `userData:${email}`;

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
        HttpStatus.BAD_REQUEST
      );
    }

    const userData = JSON.parse(userDataString);

    const createdUser = await this._userAuthRepository.register(
      userData.name ? userData.name : "",
      userData.Email,
      userData.password
    );
    const mapedUser = mapUserToDto(createdUser.user);
    await redisClient.del(redisOtpKey);
    await redisClient.del(redisDataKey);
    const accesstoken = generateToken(createdUser.user._id, "user");
    generateRefreshToken(
      createdUser.user._id,
      "user"
    );
    return {
      success: true,
      message: MESSAGES.OTP_VERIFY_SUCCESS,
      data: mapedUser,
      accesstoken,
    };
  }

  createLink = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    const admin = await this._userAuthRepository.findByEmail(email);
    if (!admin) throw new Error(MESSAGES.ADMIN_NOT_FOUND);
    const token = crypto.randomBytes(32).toString("hex");
    await redisClient.setEx(`resetPassword:${email}`, 120, token);
    await sendResetPasswordEmail(email, token, "user");
    return { success: true, message: "Password reset link sent to your email" };
  };

  resendOtp = async (email: string) => {
    const { otp, hashedOtp } = generateOtp();

    const redisOtpKey = `otp:${email}`;
    await redisClient.setEx(redisOtpKey, 120, hashedOtp);

    await resendOtpEmail(email, otp);

    return { success: true, message: MESSAGES.OTP_RESENT_SUCCESS };
  };

  async updatePassword(
    token: string,
    newPassword: string,
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const storedToken = await redisClient.get(`resetPassword:${email}`);
      if (!storedToken || storedToken !== token) {
        return { success: false, message: "Invalid or expired token" };
      }
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      const user = await this._userAuthRepository.updatePasswordByEmail(
        email,
        hashedPassword
      );
      if (!user) {
        return { success: false, message: MESSAGES.USER_NOT_FOUND };
      }
      await redisClient.del(`resetPassword:${email}`);

      return { success: true, message: MESSAGES.PASS_CHANGE_SUCCESS };
    } catch (error:any) {
      return { success: false, message: error.message ? error.message :  "Internal Server Error" };
    }
  }
}
