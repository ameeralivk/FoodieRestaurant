import { Response, Request } from "express";
export interface IOrderController {
  getAllOrders(req: Request, res: Response): Promise<Response>;
  getOrder(req: Request, res: Response): Promise<Response>;
  cancelOrder(req:Request,res:Response):Promise<Response>;
  getEntireOrderByStatus(req:Request,res:Response):Promise<Response>
  updateItemStatus(req:Request,res:Response):Promise<Response>
}
