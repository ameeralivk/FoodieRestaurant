import {
  AssignedItemsResponse,
} from "../../../types/order";
import { IUserOrderDocument } from "../../../types/order";

export interface IOrderService {
  getAllOrders(
    userId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{ data: IUserOrderDocument[] | null; total: number }>;
  getOrder(orderId: string): Promise<IUserOrderDocument | null>;
  cancelOrder(
    orderId: string,
    userId: string,
  ): Promise<{ allowed: boolean; message: string }>;
  getEntireOrdersByStatus(
    status: "PENDING" | "PREPARING" | "READY",
    restaurantId: string,
  ): Promise<{ success: boolean; order: IUserOrderDocument[] | [] }>;
  updateItemStatusService(
    orderId: string,
    itemId: string,
    status: "PENDING" | "PREPARING" | "READY",
    variant:string
  ): Promise<{ sucess: boolean; updatedOrder: IUserOrderDocument[] | [] }>;
  assignChefToItem(
    orderId: string,
    itemId: string,
    chefId: string,
    varient?:string
  ): Promise<{ success: boolean; message: string }>;
  getAssignedItems(
    orderId: string,
    chefId: string,
  ): Promise<AssignedItemsResponse>;
   assignOrder(
    orderId:string,
    staffId:string
  ):Promise<{success:boolean,message:string}>
  updateOrderStatus(
    orderId:string,
    status:string
  ):Promise<{success:boolean,message:string}>
   calculateEstimatedPrepTime(restaurantId: string,time:number): Promise<{ estimatedPrepTime: number; estimatedReadyAt: Date }>;
  getEstimate(orderId: string): Promise<{ estimatedPrepTime: number; estimatedReadyAt: Date } | null>;
}
