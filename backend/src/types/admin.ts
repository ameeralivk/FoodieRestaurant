import { Document } from "mongoose";
import { Types } from "mongoose";
export type Role = "admin" | "superAdmin";
export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}
export interface IAdmin extends Document {
   _id: Types.ObjectId;
  role: string;
  ownerName: string;
  contactNumber: Number;
  restaurantAddress: string;
  location: Location;
  openingTime: string;
  proofDocument: string;
  restaurantPhoto: string;
  closingTime: string;
  restaurantName: string;
  email: string;
  password: string;
  isDeleted: boolean;
  googleID: string;
  imageUrl: string;
  isBlocked: boolean;
  placeName: string;
  status?: "pending" | "approved" | "rejected" | "resubmitted";
  rejectionReason?: string;
  rejectedAt?: Date; 
}

export interface adminData extends Document {
  restaurantName: String;
  email: String;
  password: String;
  role: String;
  googleID: string;
  imageUrl: string;
  isBlocked: boolean;
}

export interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IRestaurantRegisterData {
  email: string;
  restaurantName: string;
  ownerName: string;
  contactNumber: string;
  restaurantAddress: string;
  openingTime: Date;
  closingTime: Date;
  latitude: string;
  longitude: string;
  restaurantPhoto: string | undefined;
  proofDocument: string | undefined;
}


export interface IAdminStatusBase {
  status: "pending" | "approved" | "rejected" | "resubmitted";
  role: string;
  isBlocked: boolean;
  restaurantName: string;
  email: string;
}
