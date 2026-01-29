
import { Response,Request } from "express"
export interface IFeedbackController{
    addFeedback(req:Request,res:Response):Promise<Response>
    getItemsRating(req:Request,res:Response):Promise<Response>
}