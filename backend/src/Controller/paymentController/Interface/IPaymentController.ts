
import { Request,Response } from "express"
export interface IPaymentController {
    createPayment(req:Request,res:Response):Promise<Response>
    webhook(req: Request, res: Response): Promise<Response | void>;
    createOrderPayment(req:Request,res:Response):Promise<Response>;
     upgrade(req: Request, res: Response): Promise<Response>;
}