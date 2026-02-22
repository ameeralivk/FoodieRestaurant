
import { Request,Response } from "express"
export interface INotificationController{
    getAllNotification(req:Request,res:Response):Promise<Response>
    markAsRead(req:Request,res:Response):Promise<Response>
}