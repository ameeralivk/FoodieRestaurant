
import { Document } from "mongoose";
import { Types } from "mongoose";
export interface IStaff extends Document {
  _id: Types.ObjectId;
  restaurantId:string;
  staffName: string;
  email: string;
  password: string;
  role: "staff" | "chef";
  status: boolean;
  createdAt: Date;
  updatedAt:Date;
  isBlocked:boolean
}

export interface RequestIStaff {
  restaurantId:string,
  staffName: string;
  email: string;
  role: "staff" | "chef";
  password?:string;
}


export interface RequestEditIStaff { 
  staffName: string;
  email: string;
  role: "staff" | "chef";
  password?:string
}

export interface EditIStaff { 
  staffId:string;
  staffName: string;
  email: string;
  role: "staff" | "chef";
  password?:string
}


export interface StaffResponseDTO {
  _id: string;
  staffName: string;
  email: string;
  role: "staff" | "chef";
  status: boolean;
  isBlocked: boolean;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

