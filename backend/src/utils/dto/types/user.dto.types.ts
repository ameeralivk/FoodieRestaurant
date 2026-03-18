import { Types } from "mongoose";

export interface IMappedUserData {
  id: Types.ObjectId | string;
  name: string;
  email: string;
  phone: string;
  allergies?: string;
  dietaryRestriction?: string;
  imageUrl: string;
  isBlocked: boolean;
  createdAt?:Date;
}

export interface IUserResponseDto {
  success: boolean;
  user: IMappedUserData;
}