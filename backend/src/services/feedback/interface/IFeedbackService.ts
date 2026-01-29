import { IFeedback } from "../../../types/feedback";
import { ItemRatingResult } from "../../../types/feedback";


export interface IFeedbackService {
    addFeedback(feedbackData:IFeedback):Promise<{success:boolean,message:string}>
    getRatingsByRestaurant(restaurantId:string):Promise<ItemRatingResult[]|null>
}