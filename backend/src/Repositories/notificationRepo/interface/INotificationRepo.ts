import { NotificationDocument } from "../../../models/notification";

export interface INotificationRepo {
  createNotification(
    recipientId: string,
    recipientModel: "User" | "staff",
    message: string,
  ):Promise<NotificationDocument | null>
  getAllByRecipientId(recipientId: string,model?:string):Promise<NotificationDocument[]|null>
  markAsRead(notificationId:string,isAll:string):Promise<boolean>
}
