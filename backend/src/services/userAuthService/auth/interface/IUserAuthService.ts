
import { IUser } from "../../../../types/usert";
import { IMappedUserData } from "../../../../utils/dto/types/user.dto.types";

export default interface IUserAuthService {
  register(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }>;
  googleAuth(
    accessToken: string
  ): Promise<{ user: IUser; accesstoken: string; refreshToken: string }>;
  login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; refreshToken: string }>;
  verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    success: boolean;
    message: string;
    data: { user: IMappedUserData};
    accesstoken: string;
  }>;
  createLink(email: string): Promise<{ success: boolean; message: string }>;
   updatePassword(
    token:string,
    email:string,
    newPassword:string,
  ):Promise<{success:boolean,message:string }>;
   resendOtp(
    email:string
  ):Promise<{success:boolean,message:string}>
}
