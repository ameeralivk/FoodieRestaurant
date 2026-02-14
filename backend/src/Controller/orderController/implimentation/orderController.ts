import { inject, injectable } from "inversify";
import { IOrderController } from "../interface/IOrderController";
import { TYPES } from "../../../DI/types";
import { IOrderService } from "../../../services/orderService/interface/IOrderService";
import { AppError } from "../../../utils/Error";
import { Response, Request } from "express";
import HttpStatus from "../../../constants/htttpStatusCode";
import { MESSAGES } from "../../../constants/messages";
import { success } from "zod";
@injectable()
export class OrderController implements IOrderController {
  constructor(
    @inject(TYPES.orderService) private _orderService: IOrderService,
  ) {}

  getAllOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, page = 1, limit = 10, search = "" } = req.query;
      const result = await this._orderService.getAllOrders(
        userId as string,
        Number(page),
        Number(limit),
        search as string,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
        total: result.total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  getOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        throw new AppError("Order NotFound");
      }
      let result = await this._orderService.getOrder(orderId);
      if (result != null) {
        return res.status(HttpStatus.OK).json({ success: true, result });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, result: [] });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };
  cancelOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { orderId } = req.params;
      const { userId } = req.body; // from auth middleware

      const result = await this._orderService.cancelOrder(
        orderId as string,
        userId,
      );

      if (!result.allowed) {
        return res.status(400).json(result);
      }

      return res.json({
        success: true,
        message: MESSAGES.ORDER_CANCELLED_SUCCESS,
      });
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  getEntireOrderByStatus = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const status = req.query.status as "PENDING" | "PREPARING" | "READY";
      const restaurantId = req.params.restaurantId as string;
      const result = await this._orderService.getEntireOrdersByStatus(
        status,
        restaurantId,
      );
      if (result) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, data: result?.order });
      } else {
        return res.status(HttpStatus.OK).json({ success: false, data: [] });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  updateItemStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { orderId, itemId, status } = req.body;
      const updatedOrder = await this._orderService.updateItemStatusService(
        orderId,
        itemId,
        status,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        data: updatedOrder,
      });
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  assignChefToItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { orderId, itemId } = req.params;
      const { chefId } = req.body;
      let result = await this._orderService.assignChefToItem(
        orderId as string,
        itemId as string,
        chefId,
      );
      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: MESSAGES.CHEFID_ASSIGNED_SUCCESS });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.CHEFID_ASSIGNED_FAILED });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  getAssignedItems = async(req: Request, res: Response): Promise<Response> =>{
    try {
      const { restaurantId, chefId } = req.params;
      let result = await this._orderService.getAssignedItems(restaurantId as string,chefId as string)
      if(result.success){
         return res.status(HttpStatus.OK).json({success:true,data:result.data})
      }else{
        return res.status(HttpStatus.BAD_REQUEST).json({success:false,message:"Fetched Failed"})
      }
    } catch (error: any) {
      throw new AppError(error.messsage);
    }
  }
}
