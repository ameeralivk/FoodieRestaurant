import { injectable, inject } from "inversify";
import { INotificationRepo } from "../../../Repositories/notificationRepo/interface/INotificationRepo";
import { INotificationService } from "../interface/INotificationService";
import { TYPES } from "../../../DI/types";
import { NotificationDocument } from "../../../models/notification";
import { MESSAGES } from "../../../constants/messages";
import { IStaffRepository } from "../../../Repositories/staff/interface/IStaffRepository";
injectable();
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private _notificationRepo: INotificationRepo,
    @inject(TYPES.staffRepository)
    private _staffRepo: IStaffRepository,
  ) {}

  async createNotification(
    recipientId: string,
    recipientModel: "User" | "staff",
    message: string,
  ): Promise<{ success: boolean; message: string }> {
    console.log(message, "message is here amerer", recipientId, "skdjls");
    const chefs = await this._staffRepo.getStaffByRole(
      recipientId,
      recipientModel == "User" ? "chef" : "staff",
    );
    console.log(chefs, "chefsl");
    if (!chefs || chefs.length === 0) {
        await this._notificationRepo.createNotification(
        recipientId,
        recipientModel,
        "",
        message,
      );
      return { success: false, message: "No chefs found for this restaurant" };
    }
    let notification;
    chefs.forEach(async (c) => {
      notification = await this._notificationRepo.createNotification(
        recipientId,
        recipientModel,
        c._id.toString(),
        message,
      );
    });
    if (notification) {
      return { success: true, message: "notification Created Successfully" };
    }
    return { success: false, message: "Notification Creation Failed" };
  }

  async getAllNotification(
    recipientId: string,
    waiterId?: string,
    model?: string,
  ): Promise<{ success: boolean; data: NotificationDocument[] | [] }> {
    let result = await this._notificationRepo.getAllByRecipientId(
      recipientId,
      waiterId,
      model,
    );
    if (result) {
      return { success: true, data: result };
    } else {
      return { success: false, data: [] };
    }
  }

  async markAsRead(
    notificationId: string,
    isAll: string,
    WorkerId?:string
  ): Promise<{ success: boolean; message: string }> {
    let result = await this._notificationRepo.markAsRead(notificationId, isAll,WorkerId);
    if (result) {
      return { success: true, message: MESSAGES.NOTI_MARK_SUCCESS };
    } else {
      return { success: false, message: MESSAGES.NOTI_MARK_FAILED };
    }
  }
}
