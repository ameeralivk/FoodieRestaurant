import { Response, Request } from "express";
export interface IOrderController {
  getAllOrders(req: Request, res: Response): Promise<Response>;
  getOrder(req: Request, res: Response): Promise<Response>;
  cancelOrder(req: Request, res: Response): Promise<Response>;
  getEntireOrderByStatus(req: Request, res: Response): Promise<Response>;
  updateItemStatus(req: Request, res: Response): Promise<Response>;
  assignChefToItem(req:Request,res:Response):Promise<Response>;
  getAssignedItems(req:Request,res:Response):Promise<Response>
  assignOrder(req:Request,res:Response):Promise<Response>
  updateOrderStatus(req:Request,res:Response):Promise<Response>
}
