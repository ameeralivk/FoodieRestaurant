import {
  AssignedItemsResponse,
  IOrderItem,
  IUserOrder,
  IVariant,
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
    restaurantId: string,
    chefId: string,
  ): Promise<AssignedItemsResponse>;
}
