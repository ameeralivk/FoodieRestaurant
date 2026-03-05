import { Document } from "mongoose";
import { Types } from "mongoose";
export interface ISubscription extends Document {
  _id: Types.ObjectId;
  planName: string;
  price: number;
  duration: string|number;
  noOfDishes: number;
  noOfStaff: number;
  features: string[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ISubscriptionPlan {
  _id?:Types.ObjectId;
  planName: string;
  price: number;       
  duration: string|number;    
  noOfDishes: number;  
  noOfStaff: number;   
  features: string[];  
}

export interface ISubscriptionDTO {
  _id:String;
  planName: string;
  price: number;       
  duration: string|number;    
  noOfDishes: number;  
  noOfStaff: number;   
  features: string[];  
}