import { Types } from "mongoose";

export interface IFeedback {
  restaurantId: Types.ObjectId;
  orderId: Types.ObjectId;
  itemId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface ItemRatingResult {
  itemId: Types.ObjectId;
  avgRating: number;
  totalReviews: number;
}
