import { Request,Response } from "express"
export interface IStaffAuthController{
    login(req:Request,res:Response):Promise<Response>
    forgetPassword(req:Request,res:Response):Promise<Response>
    updatePassword(req: Request, res: Response): Promise<Response>;
}