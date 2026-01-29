import { inject, injectable } from "inversify";
import { IFeedbackService } from "../interface/IFeedbackService";
import { TYPES } from "../../../DI/types";
import { IFeedbackRepository } from "../../../Repositories/feedback/interface/IFeedbackRepository";
import { IFeedback, ItemRatingResult } from "../../../types/feedback";
import { MESSAGES } from "../../../constants/messages";
import { Types } from "mongoose";

@injectable()
export class FeedbackService implements IFeedbackService {
  constructor(
    @inject(TYPES.FeedbackRepository)
    private _FeedbackRepo: IFeedbackRepository,
  ) {}

  async addFeedback(
    feedbackData: IFeedback,
  ): Promise<{ success: boolean; message: string }> {
    const { restaurantId, orderId, itemId } = feedbackData;

    const existingFeedback = await this._FeedbackRepo.findFeedback(
      restaurantId.toString(),
      orderId.toString(),
      itemId.toString(),
    );

    if (existingFeedback) {
      throw new Error(MESSAGES.FEEDBACK_EXIST_ALREADY);
    }

    let res = await this._FeedbackRepo.createFeedback(feedbackData);
    if(res){
        return {success:true,message:MESSAGES.FEEDBACK_ADDED_SUCCESS}
    }else{
        return {success:false,message:MESSAGES.FEEDBACK_ADDED_FAILED}
    }
  }

  getRatingsByRestaurant(restaurantId: string): Promise<ItemRatingResult[]|null> {
    let restaurantObjectId = new Types.ObjectId(restaurantId)
     return  this._FeedbackRepo.getItemRatings(
       restaurantObjectId
    );
  }
}
