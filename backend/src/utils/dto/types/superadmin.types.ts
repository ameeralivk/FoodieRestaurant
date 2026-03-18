import { Types } from "mongoose";
export interface IMappedAdminData {
  _id: Types.ObjectId;
  restaurantName: string;
  ownerName?: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "rejected" | "resubmitted";
  isBlocked: boolean;
  contactNumber?: Number;
  placeName?: string;
  location?: {
    type: "Point";
    coordinates: number[];
  };
  imageUrl?: string;
  restaurantPhoto?: string;
  openingTime?: string;
  closingTime?: string;
  proofDocument: string;
  rejectedAt:Date|null;
  reason:string;
}