import { Types } from "mongoose";

export interface ICategory{
    _id:Types.ObjectId;
    name:string;
    description:string;
    status:boolean;
    isDeleted?:boolean;
    restaurantId:Types.ObjectId;
    createdAt:Date;
}