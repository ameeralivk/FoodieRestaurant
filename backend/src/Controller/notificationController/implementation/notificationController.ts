import { INotificationController } from "../interface/INotificationController";
import { INotificationService } from "../../../services/notificationService/interface/INotificationService";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../utils/Error";
import { Request, Response } from "express";
import HttpStatus from "../../../constants/htttpStatusCode";
import { MESSAGES } from "../../../constants/messages";
@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
  ) {}

  getAllNotification = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const { recipientId,waiterId, model} = req.params;
      let result = await this._notificationService.getAllNotification(
        recipientId as string,
        waiterId as string,
        model as string,
      );
      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, data: result.data });
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, data: [] });
    } catch (error) {
      throw new AppError(error);
    }
  };
  markAsRead = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { notificationId } = req.params;
      const { isAll,WorkerId } = req.body;
      const result = await this._notificationService.markAsRead(
        notificationId as string,
        isAll as string,
        WorkerId
      );
      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: MESSAGES.NOTI_MARK_SUCCESS });
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: MESSAGES.NOTI_MARK_FAILED });
    } catch (error) {
      throw new AppError(error);
    }
  };
}
