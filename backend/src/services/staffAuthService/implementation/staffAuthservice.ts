import { inject, injectable } from "inversify";
import { IStaffRepository } from "../../../Repositories/staff/interface/IStaffRepository";
import { IStaffAuthService } from "../interface/IStaffAuthService";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../utils/Error";
import { MESSAGES } from "../../../constants/messages";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { StaffResponseDTO } from "../../../types/staff";
import { mapStaffToDTO } from "../../../utils/dto/staffDto";
import { generateRefreshToken, generateToken } from "../../../middleware/jwt";
import redisClient from "../../../config/redisClient";
import {
  sendResetPasswordEmail,
  sendResetStaffPasswordEmail,
} from "../../../helpers/sentOtp";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
@injectable()
export class StaffAuthService implements IStaffAuthService {
  constructor(
    @inject(TYPES.staffRepository) private _staffRepo: IStaffRepository,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    message: string;
    token: { token: string; refreshToken: string };
    data: StaffResponseDTO;
  }> {
    const staff = await this._staffRepo.isExist(email);
    if (staff?.isBlocked) {
      throw new AppError(MESSAGES.STAFF_BLOCKED);
    }
    if (!staff) {
      throw new AppError(MESSAGES.STAFF_NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      throw new AppError(MESSAGES.PASS_NOT_MATCH);
    }
    const token = generateToken(staff._id, staff.role);
    const refreshToken = generateRefreshToken(staff._id, staff.role);
    return {
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      token: { token: token, refreshToken: refreshToken },
      data: mapStaffToDTO(staff),
    };
  }

  createLink = async (
    email: string,
  ): Promise<{ success: boolean; message: string }> => {
    const admin = await this._staffRepo.findByEmail(email);
    if (!admin) throw new Error(MESSAGES.ADMIN_NOT_FOUND);
    const token = crypto.randomBytes(32).toString("hex");
    await redisClient.setEx(`resetPassword:${email}`, 120, token);
    await sendResetStaffPasswordEmail(email, token, "staff");
    return { success: true, message: "Password reset link sent to your email" };
  };

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
      const ExistStaff = await this._staffRepo.findByEmail(email)
      if(!ExistStaff){
        throw new AppError(MESSAGES.STAFF_NOT_FOUND)
      }
      const staff = await this._staffRepo.updatePassword(ExistStaff._id.toString(), hashedPassword);
      if (!staff) {
        return { success: false, message: MESSAGES.USER_NOT_FOUND };
      }
      await redisClient.del(`resetPassword:${email}`);

      return { success: true, message: MESSAGES.PASS_CHANGE_SUCCESS };
    } catch (error: any) {
      return {
        success: false,
        message: error.message ? error.message : "Internal Server Error",
      };
    }
  }
}
