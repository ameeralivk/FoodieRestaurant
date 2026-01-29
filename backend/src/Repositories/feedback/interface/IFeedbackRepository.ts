import { IFeedback, ItemRatingResult } from "../../../types/feedback";
import { Types } from "mongoose";


export interface IFeedbackRepository {
    findFeedback(restaurantId:string,orderId:string,itemId:string):Promise<IFeedback|null>
    createFeedback(feedbackData:IFeedback):Promise<IFeedback|null>
    getItemRatings(restaurantId:Types.ObjectId):Promise<ItemRatingResult[]|null>

}