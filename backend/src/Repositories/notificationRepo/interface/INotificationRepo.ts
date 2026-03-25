import { NotificationDocument } from "../../../models/notification";

export interface INotificationRepo {
  createNotification(
    recipientId: string,
    recipientModel: "User" | "staff",
    WorkerId:string,
    message: string,
  ):Promise<NotificationDocument | null>
  getAllByRecipientId(recipientId: string,waiterId?:string,model?:string):Promise<NotificationDocument[]|null>
  markAsRead(notificationId:string,isAll:string,WorkerId?:string):Promise<boolean>
}
