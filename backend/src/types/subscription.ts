import mongoose, { Document } from "mongoose";

export interface IPlanSnapshot {
  planName: string;
  planPrice: number;
  duration: number|string;
  noOfDishes: number;
  noOfStaff: number;
  features: string[]; 
}

export interface ISubscriptiontype extends Document {
   _id: mongoose.Types.ObjectId; 
  restaurentId:mongoose.Types.ObjectId | undefined;
  planSnapshot: IPlanSnapshot;
  planId:mongoose.Types.ObjectId | undefined;
  planName: string;
  planPrice: number;

  status: "active" | "expired" | "cancelled" | "pending"|"queued";

  stripeSessionId: string;
  stripePaymentIntentId: string;

  startDate: Date;
  endDate: Date;
  renewalDate: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface AddSubscriptionType {
  restaurentId: mongoose.Types.ObjectId | undefined;
  planId: mongoose.Types.ObjectId | undefined;
  planSnapshot:IPlanSnapshot;
  planName: string;
  planPrice: number;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  startDate: Date;
  renewalDate: Date;
  status: "active" | "inactive" | "expired"|"queued";
}


export interface PlanDto {
  _id: string;
  planName: string;
  planPrice: number;
  status: "active" | "expired" | "cancelled" | "pending" | "queued";
  startDate: string;
  renewalDate: string;
}


