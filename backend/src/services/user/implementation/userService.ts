import { IUserRepository } from "../../../Repositories/user/interface/IUserRepository";
import { IUserService } from "../interface/IUserService";
import { IUser } from "../../../types/usert";
import { AppError } from "../../../utils/Error";
import { MESSAGES } from "../../../constants/messages";
import HttpStatus from "../../../constants/htttpStatusCode";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../DI/types";
import { UpdateProfileResult } from "../../../types/usert";
import { mapUserDto } from "../../../utils/dto/userDto";
import { IMappedUserData } from "../../../utils/dto/types/user.dto.types";
import redisClient from "../../../config/redisClient";
import { sentOtp } from "../../../helpers/sentOtp";
import { generateOtp, hashOtp } from "../../../helpers/generateOtp";
import bcrypt from "bcrypt";
import { deleteFromS3, getS3KeyFromUrl } from "../../../helpers/s3Service";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.userRepository) private _userRepo: IUserRepository
  ) {}

  async getAllUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{
    users: IMappedUserData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const users = await this._userRepo.getAllUsers(search, page, limit);
    const mappedUser = users.data.map((user) => mapUserDto(user));
    if (!users || users.data.length === 0) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return {
      users: mappedUser,
      total: users.total,
      page,
      limit,
      totalPages: Math.ceil(users.total / limit),
    };
  }

  async updateUserStatus(userId: string, isBlocked: boolean): Promise<IUser> {
    const user = await this._userRepo.updateStatus(userId, isBlocked);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserDetails(userId: string): Promise<Partial<IUser>> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id.toString(),
      Name: user.Name,
      Email: user.Email,
      phone: user.phone,
      imageUrl: user.imageUrl,
    };
  }

  async updateProfile(
    userId: string,
    name: string,
    phone: string,
    email: string
  ): Promise<UpdateProfileResult> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);

    if (email && email !== user.Email) {
      const redisDataKey = `profile:update:data:${email}`;
      const redisOtpKey = `profile:update:otp:${email}`;
      const { otp, hashedOtp } = generateOtp();

      await redisClient.setEx(
        redisDataKey,
        120,
        JSON.stringify({
          userId,
          name,
          phone,
          email,
        })
      );
      await redisClient.setEx(redisOtpKey, 600, hashedOtp);

      await sentOtp(email, otp);

      return { requiresEmailVerification: true };
    }

    await this._userRepo.updateUser(userId, {
      name,
      phone,
    });

    return { updated: true };
  }

  async verifyEmailOtp(
    email: string,
    otp: string
  ): Promise<{ success: true; message: string }> {
    const redisOtpKey = `profile:update:otp:${email}`;
    const redisDataKey = `profile:update:data:${email}`;
    const storedHashedOtp = await redisClient.get(redisOtpKey);
    const hashedIncomingOtp = hashOtp(otp);
    if (!storedHashedOtp) throw new Error("OTP expired");
    if (hashedIncomingOtp !== storedHashedOtp) {
      throw new Error("Invalid OTP");
    }
    const storedData = await redisClient.get(redisDataKey);
    if (!storedData) throw new Error("Session expired");

    const { userId, name, phone } = JSON.parse(storedData);

    await this._userRepo.updateUser(userId, {
      name,
      phone,
      email,
    });

    // cleanup
    await redisClient.del(redisOtpKey);
    await redisClient.del(redisDataKey);

    return {
      success: true,
      message: "updated sucessfully",
    };
  }

  async updateProfilePhoto(
    image: string,
    userId: string
  ): Promise<{ success: boolean; message: string; image?: string }> {
    const user = await this._userRepo.findById(userId);
    if (!user) return { success: false, message: MESSAGES.USER_NOT_FOUND };
    const oldImageUrl = user.imageUrl;

    if (
      oldImageUrl &&
      oldImageUrl.includes("foodierestaurent.s3.ap-south-1.amazonaws.com")
    ) {
      try {
        const key = getS3KeyFromUrl(oldImageUrl);
        await deleteFromS3(key);
      } catch (error) {
        console.error("Failed to delete old S3 image:", error);
      }
    }
    let result = await this._userRepo.updateProfileImage(image, userId);
    if (result) {
      return {
        success: true,
        message: MESSAGES.PROFILE_IMAGE_ADDED_SUCCESS,
        image,
      };
    }
    return { success: false, message: MESSAGES.PROFILE_IMAGE_UPDATE_FAILED };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      return { success: false, message: MESSAGES.USER_NOT_FOUND };
    }
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return { success: false, message: MESSAGES.INVALID_CURRENT_PASSWORD };
    }
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await this._userRepo.updatePassword(userId, hashedPassword);
    return {
      success: true,
      message: MESSAGES.PASSWORD_CHANGED_SUCCESS,
    };
  }
}
