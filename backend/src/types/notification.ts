
import mongoose from "mongoose";
export interface INotificationInterface {
  recipientId: mongoose.Types.ObjectId;
  recipientModel: "User" | "staff"; // change if different
  WorkerId?:string;
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
