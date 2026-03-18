import { Types } from "mongoose";

export interface AdminDTO {
  _id: Types.ObjectId;
  role: string;
  restaurantName: string;
  email: string;
  googleId: string | null;
  imageUrl: string | null;
  status: string;
  rejectedAt: Date | null;
  rejectionReason: string | null;
}

export interface AdminStatusDTO {
  status: "pending" | "approved" | "rejected" | "resubmitted" | undefined;
  role: string;
  isBlocked: boolean;
  restaurantName: string;
  email: string;
  rejectionReason?: string;
  rejectedAt?: Date | null;
}