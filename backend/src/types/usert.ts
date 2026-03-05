import { Document } from "mongoose";
import { Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  Email: string;
  Name: string;
  password: string;
  phone: string;
  Allergies?: string;
  DietaryRestriction?: string;
  googleID: string;
  imageUrl: string;
  isDeleted:boolean;
  isBlocked:boolean;
  createdAt?:Date;
}

export type UpdateProfileResult =
  | { requiresEmailVerification: true }
  | { updated: true };
