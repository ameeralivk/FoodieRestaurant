import { Types } from "mongoose";
import { FeedbackDocument, FeedbackModel } from "../../../models/feedback";
import { IFeedback ,ItemRatingResult } from "../../../types/feedback";
import { BaseRepository } from "../../IBaseRepository";
import { IFeedbackRepository } from "../interface/IFeedbackRepository";
export class FeedbackRepository
  extends BaseRepository<FeedbackDocument>
  implements IFeedbackRepository
{
  constructor() {
    super(FeedbackModel);
  }

  async findFeedback(
    restaurantId: string,
    orderId: string,
    itemId: string,
  ): Promise<IFeedback|null> {
    return await this.getByFilter({
      restaurantId,
      orderId,
      itemId,
    });
  }

  async createFeedback(feedbackData: IFeedback): Promise<IFeedback|null> {
      return await this.create(feedbackData)
  }

  async getItemRatings(restaurantId: Types.ObjectId): Promise<ItemRatingResult[] | null> {
    return  this.model.aggregate([
      {
        $match: {
          restaurantId: new Types.ObjectId(restaurantId)
        }
      },
      {
        $group: {
          _id: "$itemId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          itemId: "$_id",
          avgRating: { $round: ["$avgRating", 1] },
          totalReviews: 1
        }
      }
    ]);
  }
}
