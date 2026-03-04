import { NotificationDocument } from "../../../models/notification"

export interface INotificationService {
  createNotification(
    recipientId: string,
    recipientModel: "User" | "staff",
    message: string,
  ):Promise<{success:boolean,message:string}>
  getAllNotification(recipientId: string,model?:string):Promise<{success:boolean,data:NotificationDocument[]|[]}>
  markAsRead(notificationId:string,isAll:string):Promise<{success:boolean,message:string}>
}
