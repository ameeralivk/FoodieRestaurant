import { IOrderItem, IUserOrder } from "../../../types/order";
import { IUserOrderDocument } from "../../../types/order";

export interface IOrderService {
  getAllOrders(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ data: IUserOrderDocument[] | null; total: number }>;
  getOrder(orderId: string): Promise<IUserOrderDocument | null>;
  cancelOrder(orderId: string, userId: string): Promise<{ allowed: boolean ,message:string}>;
}
