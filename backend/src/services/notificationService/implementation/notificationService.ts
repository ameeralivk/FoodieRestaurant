import { injectable, inject } from "inversify";
import { INotificationRepo } from "../../../Repositories/notificationRepo/interface/INotificationRepo";
import { INotificationService } from "../interface/INotificationService";
import { TYPES } from "../../../DI/types";
import { NotificationDocument } from "../../../models/notification";
import { MESSAGES } from "../../../constants/messages";
injectable();
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private _notificationRepo: INotificationRepo,
  ) {}

  async createNotification(
    recipientId: string,
    recipientModel: "User" | "staff",
    message: string,
  ): Promise<{ success: boolean; message: string }> {
     const notification = await this._notificationRepo.createNotification(
      recipientId,
      recipientModel,
      message,
    );
    if(notification){
        return {success:true,message:"notification Created Successfully"}
    }
    return {success:false,message:"Notification Creation Failed"}
  }

  async getAllNotification(recipientId: string,model?:string): Promise<{ success: boolean; data:NotificationDocument[]|[]; }> {
   let result =  await this._notificationRepo.getAllByRecipientId(recipientId,model)
   if(result){
    return {success:true,data:result}
   }else{
    return {success:false,data:[]}
   }
  }

  async markAsRead(notificationId: string,isAll:string): Promise<{ success: boolean; message: string; }> {
     let result = await this._notificationRepo.markAsRead(notificationId,isAll)
     if(result){
      return {success:true,message:MESSAGES.NOTI_MARK_SUCCESS}
     }else{
      return {success:false,message:MESSAGES.NOTI_MARK_FAILED}
     }
  }
}
