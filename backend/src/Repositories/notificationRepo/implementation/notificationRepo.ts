import { BaseRepository } from "../../BaseRepository";
import Notification, {
  NotificationDocument,
} from "../../../models/notification";
import { INotificationRepo } from "../interface/INotificationRepo";
import mongoose, { Mongoose, Types } from "mongoose";

export class NotificationRepository
  extends BaseRepository<NotificationDocument>
  implements INotificationRepo
{
  constructor() {
    super(Notification);
  }
  async createNotification(
    recipientId: string,
    recipientModel: "User" | "staff",
    WorkerId: string,
    message: string,
  ): Promise<NotificationDocument | null> {
    if (WorkerId != "") {
      return await this.create({
        recipientId: new Types.ObjectId(recipientId),
        recipientModel,
        WorkerId,
        message,
      });
    }
    return await this.create({
      recipientId: new Types.ObjectId(recipientId),
      recipientModel,
      message,
    });
  }


  async getAllByRecipientId(
    recipientId: string,
    waiterId?: string,
    model?: string,
  ): Promise<NotificationDocument[] | null> {
    const query: any = {
      recipientId: new mongoose.Types.ObjectId(recipientId),
      recipientModel: model === "staff" ? "staff" : "User",
      isRead: false,
      isDeleted: false,
    };
    if (waiterId && waiterId !== "undefined") {
      query.WorkerId = waiterId;
    }
    return await this.model.find(query);
  } 

  async markAsRead(notificationId: string, isAll: string,WorkerId?:string): Promise<boolean> {
    if (isAll === "true" && WorkerId) {
      const result = await this.model.updateMany(
        { recipientId: notificationId,WorkerId },
        { $set: { isRead: true } },
      );

      return result.modifiedCount > 0;
    }
    if (isAll === "true") {
      const result = await this.model.updateMany(
        { recipientId: notificationId },
        { $set: { isRead: true } },
      );

      return result.modifiedCount > 0;
    }

    const result = await this.model.findByIdAndUpdate(notificationId, {
      $set: { isRead: true },
    });

    return result !== null;
  }
}
