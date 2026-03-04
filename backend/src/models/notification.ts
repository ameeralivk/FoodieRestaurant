import { Schema } from "mongoose";
import { Document } from "mongoose";
import mongoose from "mongoose";
import { INotificationInterface } from "../types/notification";

export type NotificationDocument = INotificationInterface & Document;

const notificationSchema = new Schema<NotificationDocument>(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel", // 🔥 dynamic reference
      index: true,
    },

    recipientModel: {
      type: String,
      required: true,
      enum: ["User", "staff"], // your two models
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema
);

export default Notification;