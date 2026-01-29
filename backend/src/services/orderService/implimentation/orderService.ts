import { inject, injectable } from "inversify";
import { IOrderService } from "../interface/IOrderService";
import { TYPES } from "../../../DI/types";
import { IOrderRepo } from "../../../Repositories/order/interface/interface";
import {
  IOrderItem,
  IUserOrder,
  IUserOrderDocument,
} from "../../../types/order";
import { MESSAGES } from "../../../constants/messages";
import { IUserWalletRepository } from "../../../Repositories/userWallet/interface/IImplementation";

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject(TYPES.orderRepository) private _orderRepo: IOrderRepo,
    @inject(TYPES.userWalletRepository)
    private _userWalletRepo: IUserWalletRepository
  ) {}

  getAllOrders(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ data: IUserOrderDocument[] | null; total: number }> {
    return this._orderRepo.getAllOrders(
      userId,
      page,
      limit,
      search
    );
  }

  getOrder(orderId: string): Promise<IUserOrderDocument | null> {
    return this._orderRepo.getOrder(orderId);
  }
  async cancelOrder(
    orderId: string,
    userId: string
  ): Promise<{ allowed: boolean; message: string }> {
    const order = await this._orderRepo.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.orderStatus === "CANCELLED") {
      throw new Error("Order already cancelled");
    }
    if (
      order.orderStatus === "PREPARING" ||
      order.orderStatus === "READY" ||
      order.orderStatus === "SERVED"
    ) {
      return {
        allowed: false,
        message: "Order cannot be cancelled at this stage",
      };
    }
    let result = await this._orderRepo.changeStatus(orderId, "CANCELLED");
    if (result) {
      let refundAmount = order.totalAmount;
      if (refundAmount > 0) {
        await this._userWalletRepo.creditWallet(
          userId,
          refundAmount,
          `Refund for order ${order.orderId}`,
          "ORDER_CANCELLATION"
        );
      }
      return {
        allowed: true,
        message: MESSAGES.ORDER_CANCELLED_SUCCESS,
      };
    } else {
      return {
        allowed: false,
        message: MESSAGES.ORDER_CANCELLED_FAILED,
      };
    }
  }
}
