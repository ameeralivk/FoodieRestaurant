import { BaseRepository } from "../../IBaseRepository";
import Notification, {
  NotificationDocument,
} from "../../../models/notification";
import { INotificationRepo } from "../interface/INotificationRepo";
import { Types } from "mongoose";

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
    message: string,
  ): Promise<NotificationDocument | null> {
    return await this.create({
      recipientId: new Types.ObjectId(recipientId),
      recipientModel,
      message,
    });
  }

  async getAllByRecipientId(
    recipientId: string,
  ): Promise<NotificationDocument[] | null> {
    return await this.model.find({
      recipientId,
      isRead: false,
      isDeleted: false,
    });
  }

  async markAsRead(notificationId: string, isAll: string): Promise<boolean> {
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
