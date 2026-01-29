import { inject, injectable } from "inversify";
import { IFeedbackService } from "../../../services/feedback/interface/IFeedbackService";
import { IFeedbackController } from "../interface/IFeedbackController";
import { TYPES } from "../../../DI/types";
import { Request, Response } from "express";
import { IFeedback } from "../../../types/feedback";
import { AppError } from "../../../utils/Error";
@injectable()
export class FeedbackController implements IFeedbackController {
  constructor(
    @inject(TYPES.FeedbackService) private _FeedbackService: IFeedbackService,
  ) {}

  addFeedback = async(req: Request, res: Response): Promise<Response> => {
    try {
      const feedbackData: IFeedback = req.body;

      const feedback = await this._FeedbackService.addFeedback(feedbackData);

      return res.status(201).json({
        success: true,
        message: "Feedback added successfully",
        data: feedback,
      });
    } catch (error:any) {
        throw new AppError(error.message)
    }
  }

  getItemsRating = async(req: Request, res: Response): Promise<Response>=> {
    try {
       const { restaurantId } = req.params;

      const ratings = await this._FeedbackService.getRatingsByRestaurant(
        restaurantId as string
      );

      return res.status(200).json({
        success: true,
        data: ratings
      });
    } catch (error:any) {
       throw new AppError(error.message)
    }
  }
}
