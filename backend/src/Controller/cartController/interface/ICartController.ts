
import { Request,Response } from "express"
export interface ICartController{
     addToCart(req:Request,res:Response):Promise<Response>;
     updateQuantity(req:Request,res:Response):Promise<Response>;
     getCart(req:Request,res:Response):Promise<Response>;
     deleteCart(req:Request,res:Response):Promise<Response>;
     addInstruction(req:Request,res:Response):Promise<Response>
}