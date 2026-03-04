import { Request,Response } from "express"

export interface IUserWalletController{
     getWallet(req:Request,res:Response):Promise<Response>
     payWithWallet(req:Request,res:Response):Promise<Response>
}