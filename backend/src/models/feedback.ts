import mongoose, { Schema, Document } from "mongoose";
import { IFeedback } from "../types/feedback";

export interface FeedbackDocument extends IFeedback, Document {}

const feedbackSchema = new Schema<FeedbackDocument>({
  restaurantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Admin"
  },
  orderId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "UserOrder"
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "items"
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

feedbackSchema.index(
  { restaurantId: 1, orderId: 1, itemId: 1 },
  { unique: true }
);

export const FeedbackModel = mongoose.model<FeedbackDocument>(
  "Feedback",
  feedbackSchema
);
