
import { Request,Response } from "express"
export interface IStaffController{
    addStaff(req:Request,res:Response):Promise<Response>
    editStaff(req:Request,res:Response):Promise<Response>
    deleteStaff(req:Request,res:Response):Promise<Response>
    changeStatus(req:Request,res:Response):Promise<Response>
    getAllStaff(req:Request,res:Response):Promise<Response>
    changePassword(req:Request,res:Response):Promise<Response>
    getStaff(req:Request,res:Response):Promise<Response>
}