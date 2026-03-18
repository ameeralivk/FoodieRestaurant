import { otpResponse } from "../../../helpers/sentOtp";
import { AdminDocument } from "../../../models/admin";
import type { IAdminStatusBase, IRestaurantRegisterData } from "../../../types/admin";
import { AdminDTO } from "../../../utils/dto/types/admin.dto.types";
export default interface IAdminAuthService {
  login(
    email: string,
    password: string
  ): Promise<{ mapedAdmin: AdminDTO; token: string; refreshToken: string }>;
  register(
    restaurantName: String,
    email: String,
    password: String,
    role: "admin" | "superadmin"
  ): Promise<{ success: boolean; message: otpResponse }>;
  verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    success: boolean;
    message: string;
    data: { admin: AdminDocument };
    accesstoken: string;
  }>;
  resendOtp(email: string): Promise<{ success: boolean; message: string }>;
  googleAuth(
    accessToken: string
  ): Promise<{
    mapedAdmin: AdminDTO;
    accesstoken: string;
    refreshToken: string;
  }>;
  refreshToken(refreshToken: string): Promise<{ newAccessToken: string }>;
  createLink(email: string): Promise<{ success: boolean; message: string }>;
  updatePassword(
    token: string,
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }>;
  registerRestaurant(
    Data: IRestaurantRegisterData
  ): Promise<{ success: boolean; message: string }>;
  getStatus(adminId: string): Promise<{ responseStatus:IAdminStatusBase}>;
  updateDocument(adminId:string,file:string):Promise<{success:boolean,message:string}>
}
