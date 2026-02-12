import { inject, injectable } from "inversify";
import { IOrderService } from "../interface/IOrderService";
import { TYPES } from "../../../DI/types";
import { IOrderRepo } from "../../../Repositories/order/interface/interface";
import { getIO } from "../../../config/socket";
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
    private _userWalletRepo: IUserWalletRepository,
  ) {}

  getAllOrders(
    userId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{ data: IUserOrderDocument[] | null; total: number }> {
    return this._orderRepo.getAllOrders(userId, page, limit, search);
  }

  getOrder(orderId: string): Promise<IUserOrderDocument | null> {
    return this._orderRepo.getOrder(orderId);
  }
  async cancelOrder(
    orderId: string,
    userId: string,
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
          "ORDER_CANCELLATION",
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

  async getEntireOrdersByStatus(
    status: "PENDING" | "PREPARING" | "READY",
    restaurantId: string,
  ): Promise<{ success: boolean; order: IUserOrderDocument[] | [] }> {
    let res = await this._orderRepo.getEntireOrdersByStatus(
      status,
      restaurantId,
    );
    if (res) {
      return { success: true, order: res };
    } else {
      return { success: false, order: [] };
    }
  }

  async updateItemStatusService(
    orderId: string,
    itemId: string,
    status: "PENDING" | "PREPARING" | "READY",
  ): Promise<{ sucess: boolean; updatedOrder: IUserOrderDocument[] | [] }> {
    let res = await this._orderRepo.updateItem(orderId, itemId, status);
    let order = await this._orderRepo.getOrder(orderId);
    if (res) {
      let AllOrderReady = order?.items.every((o) => o.itemStatus === "READY");
      let AnyPreparing = order?.items.some((o) => o.itemStatus === "PREPARING");

      const io = getIO();
      if (order?.userId) {
        const userRoom = `${order.userId.toString()}-user`;

        console.log("📤 Emitting to:", userRoom);

        io.to(userRoom).emit("order:itemUpdated", {
          orderId,
          itemId,
          orderStatus: status,
          order,
          message: `Your order item ${itemId} is now ${status}`,
        });
      }

      if (AllOrderReady || AnyPreparing) {
        if (!order?._id) return { sucess: false, updatedOrder: [] };
        let updatedOrder = await this._orderRepo.changeStatus(
          order?._id?.toString(),
          AnyPreparing ? "PREPARING" : "READY",
        );
        const restaurantId = order?.restaurantId.toString();
        if (!AnyPreparing) {
          io.to(`${restaurantId}-staff`).emit("order:completed", {
            order,
            orderId,
            message: `Order ${orderId} is READY`,
          });
        }

        if (order?.userId) {
          const userRoom = `${order.userId.toString()}-user`;

          console.log("📤 Emitting to:", userRoom);

          io.to(userRoom).emit("order:itemUpdated", {
            orderId,
            itemId,
            orderStatus: status,
            order: updatedOrder,
            message: `Your order item ${itemId} is now ${status}`,
          });
        }

        console.log("✅ Order completed event emitted to staff room");
      }

      return { sucess: true, updatedOrder: res };
    }
    return { sucess: false, updatedOrder: [] };
  }
}
