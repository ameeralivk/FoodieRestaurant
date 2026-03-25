import { inject, injectable } from "inversify";
import { IOrderService } from "../interface/IOrderService";
import { TYPES } from "../../../DI/types";
import { IOrderRepo } from "../../../Repositories/order/interface/interface";
import { Types } from "mongoose";
import { getIO } from "../../../config/socket";
import { AssignedItemsResponse, AssignedItem } from "../../../types/order";
import { IUserOrderDocument } from "../../../types/order";
import { MESSAGES } from "../../../constants/messages";
import { IUserWalletRepository } from "../../../Repositories/userWallet/interface/IImplementation";
import { INotificationService } from "../../notificationService/interface/INotificationService";
import { IStaffRepository } from "../../../Repositories/staff/interface/IStaffRepository";

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject(TYPES.orderRepository) private _orderRepo: IOrderRepo,
    @inject(TYPES.userWalletRepository)
    private _userWalletRepo: IUserWalletRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.staffRepository)
    private StaffRepo: IStaffRepository,
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
    variant: string,
  ): Promise<{ sucess: boolean; updatedOrder: IUserOrderDocument[] | [] }> {
    let res = await this._orderRepo.updateItem(
      orderId,
      itemId,
      status,
      variant,
    );

    let order = await this._orderRepo.getOrder(orderId);
    const item = order?.items.find((i) => i.itemId.toString() === itemId);

    if (res) {
      let AllOrderReady = order?.items.every((o) => o.itemStatus === "READY");
      let AnyPreparing = order?.items.some((o) => o.itemStatus === "PREPARING");
      if (AnyPreparing) {
        await this._orderRepo.updateOrder(orderId, "PREPARING");
      }

      const io = getIO();

      if (order?.userId && !AnyPreparing && !AllOrderReady) {
        const userRoom = `${order.userId.toString()}-user`;

        console.log("📤 Emitting to:", userRoom);

        io.to(userRoom).emit("order:itemUpdated", {
          orderId,
          itemId,
          orderStatus: status,
          order,
          message: `Your order item ${item?.itemName} is now ${status}`,
        });

        await this._notificationService.createNotification(
          order.userId.toString(),
          "User",
          `Your order item ${item?.itemName} is now ${status}`,
        );
      }

      if (AllOrderReady || AnyPreparing) {
        if (!order?._id) return { sucess: false, updatedOrder: [] };

        let updatedOrder = await this._orderRepo.changeStatus(
          order?._id?.toString(),
          AnyPreparing ? "PREPARING" : "READY",
        );

        const restaurantId = order?.restaurantId.toString();

        if (AllOrderReady) {
          const userRoom = `${order.userId.toString()}-user`;
          io.to(`${restaurantId}-staff`).emit("order:completed", {
            order,
            orderId,
            message: `Order ${orderId} is READY`,
          });
          io.to(userRoom).emit("order:itemUpdated", {
            orderId,
            itemId,
            orderStatus: status,
            order: updatedOrder,
            message: `Your order item ${orderId} is now Ready`,
          });

          await this._notificationService.createNotification(
            order.restaurantId.toString(),
            "staff",
            `Order ${orderId} is READY`,
          );
          await this._notificationService.createNotification(
            order.userId.toString(),
            "User",
            `Order ${orderId} is READY`,
          );
        }

        if (order?.userId && !AllOrderReady) {
          const userRoom = `${order.userId.toString()}-user`;

          console.log("📤 Emitting to:", userRoom);
          let res = await this._notificationService.createNotification(
            order.userId.toString(),
            "User",
            `Your order item ${item?.itemName} is now ${status}`,
          );
          io.to(userRoom).emit("order:itemUpdated", {
            orderId,
            itemId,
            orderStatus: status,
            order: updatedOrder,
            message: res,
          });
        }

        console.log("✅ Order completed event emitted to staff room");
      }

      return { sucess: true, updatedOrder: res };
    }

    return { sucess: false, updatedOrder: [] };
  }

  async assignChefToItem(
    orderId: string,
    itemId: string,
    chefId: string,
    varient?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!orderId) {
      return { success: false, message: MESSAGES.ORDERID_NOT_FOUND };
    } else if (!itemId) {
      return { success: false, message: MESSAGES.ITEMID_NOT_FOUND };
    } else if (!chefId) {
      return { success: false, message: MESSAGES.CHEFFID_NOT_FOUND };
    }
    let res = await this._orderRepo.assignChefToItem(
      orderId,
      itemId,
      chefId,
      varient,
    );
    let order = await this._orderRepo.getOrder(orderId);
    const item = order?.items.find((i) => i.itemId.toString() === itemId);
    let IsAllItemAssigned = order?.items.every(
      (i) => i.itemStatus === "ASSIGNED",
    );
    if (res) {
      const io = getIO();
      if (order?.userId) {
        const userRoom = `${order.userId.toString()}-user`;

        console.log("📤 Emitting to:", userRoom);

        io.to(userRoom).emit("order:itemUpdated", {
          orderId,
          itemId,
          orderStatus: "ASSIGNED",
          order: order,
          message: `Your order item ${item?.itemName} is now ASSIGNED`,
        });
        await this._notificationService.createNotification(
          order.userId.toString(),
          "User",
          `Your order item ${item?.itemName} is now ASSIGNED`,
        );
      }

      if (IsAllItemAssigned) {
        await this._orderRepo.changeStatus(String(res._id), "ASSIGNED");
      }
      return {
        success: true,
        message: MESSAGES.CHEFID_ASSIGNED_SUCCESS,
      };
    } else {
      return {
        success: false,
        message: MESSAGES.CHEFID_ASSIGNED_FAILED,
      };
    }
  }

  async getAssignedItems(
    restaurantId: string,
    chefId: string,
  ): Promise<AssignedItemsResponse> {
    const orders = await this._orderRepo.getAssignedItems(restaurantId);

    if (!orders?.length) {
      return { success: true, data: [] };
    }
    const chefObjectId = new Types.ObjectId(chefId);
    console.log(orders.forEach((x) => console.log(x.items)));
    const assignedItems: AssignedItem[] = orders.flatMap((order) =>
      order.items
        .filter((item) => item.assignedCookId?.equals(chefObjectId))
        .map((item) => ({
          orderId: order.orderId,
          item: {
            itemId: item.itemId.toString(),
            itemName: item.itemName,
            itemStatus: item.itemStatus,
            quantity: item.quantity,
            price: item.price,
            instruction: item.instraction,
            variant: item.variant,
            assignedCookId: item.assignedCookId?.toString(),
            itemImages: item.itemImages,
          },
          tableNumber: order.tableId,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
        })),
    );

    return { success: true, data: assignedItems };
  }

  async assignOrder(
    orderId: string,
    staffId: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!orderId) {
      return { success: false, message: MESSAGES.ORDERID_NOT_FOUND };
    }
    if (!staffId) {
      return { success: false, message: MESSAGES.STAFF_ID_NOTFOUND };
    }
    let result = await this._orderRepo.assignOrder(orderId, staffId);

    if (result) {
      const io = getIO();
      const order = await this._orderRepo.getOrder(orderId);
      if (order?.userId) {
        const userRoom = `${order?.userId.toString()}-user`;
        console.log("📤 Emitting to:", userRoom);
        io.to(userRoom).emit("order:assigned", {
          orderId,
          staffId,
          orderStatus: "ASSIGNED",
          message: `Your order ${orderId} has been assigned to staff.`,
        });
        await this._notificationService.createNotification(
          order.userId.toString(),
          "User",
          `Your order ${orderId} has been assigned to staff.`,
        );
      }
      return { success: true, message: "staff Assigning Completed" };
    } else {
      return { success: false, message: "staff Assiging Failed" };
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
  ): Promise<{ success: boolean; message: string }> {
    let order = await this._orderRepo.getOrder(orderId);
    if (!order) return { success: false, message: MESSAGES.ORDER_NOT_FOUND };
    let result = await this._orderRepo.updateOrder(orderId, status);
    if (result) {
      const io = getIO();
      if (order?.userId) {
        const userRoom = `${order.userId.toString()}-user`;
        console.log("📤 Emitting to:", userRoom);
        io.to(userRoom).emit("order:statusUpdated", {
          orderId,
          orderStatus: status,
          message: `Your order ${orderId} status is now ${status}.`,
        });
        await this._notificationService.createNotification(
          order.userId.toString(),
          "User",
          `Your order ${orderId} status is now ${status}.`,
        );
      }

      return { success: true, message: MESSAGES.ORDER_UPDATED_SUCCESSFULL };
    } else {
      return { success: false, message: MESSAGES.ORDER_UPDATED_FAILED };
    }
  }

  // async calculateEstimatedPrepTime(
  //   restaurantId: string,
  // ): Promise<{ estimatedPrepTime: number; estimatedReadyAt: Date }> {
  //   const staffCount = await this.StaffRepo.totalCount(restaurantId);
  //   const actualStaffCount = staffCount > 0 ? staffCount : 1;

  //   const activeOrders = await this._orderRepo.totalCount(restaurantId);

  //   const averagePrepTime = 10;
  //   const ordersPerStaff = Math.ceil(Number(activeOrders) / actualStaffCount);
  //   const estimatedPrepTime = ordersPerStaff * averagePrepTime;

  //   const estimatedReadyAt = new Date();
  //   estimatedReadyAt.setMinutes(
  //     estimatedReadyAt.getMinutes() + estimatedPrepTime,
  //   );

  //   return { estimatedPrepTime, estimatedReadyAt };
  // }

  async calculateEstimatedPrepTime(
    restaurantId: string,
    time: number,
  ): Promise<{ estimatedPrepTime: number; estimatedReadyAt: Date }> {
    const staffCount = await this.StaffRepo.totalCount(restaurantId);
    const actualStaffCount = staffCount > 0 ? staffCount : 1;

    const activeOrders = await this._orderRepo.activeOrders(restaurantId);
    const allOrders = [
      ...activeOrders.map((order) => ({
        prepTime: order.estimatedPrepTime || 10,
      })),
      { prepTime: time},
    ];

    const staffAvailability = Array(actualStaffCount).fill(0);
    for (const order of allOrders) {
      const prepTime = order.prepTime;

      let minIndex = 0;
      for (let i = 1; i < staffAvailability.length; i++) {
        if (staffAvailability[i] < staffAvailability[minIndex]) {
          minIndex = i;
        }
      }

      staffAvailability[minIndex] += prepTime;
    }

    const estimatedPrepTime = Math.max(...staffAvailability);

    const estimatedReadyAt = new Date();
    estimatedReadyAt.setMinutes(
      estimatedReadyAt.getMinutes() + estimatedPrepTime,
    );

    return { estimatedPrepTime, estimatedReadyAt };
  }

  async getEstimate(
    orderId: string,
  ): Promise<{ estimatedPrepTime: number; estimatedReadyAt: Date } | null> {
    const order = await this.getOrder(orderId);
    if (!order) return null;
    return {
      estimatedPrepTime: order.estimatedPrepTime || 0,
      estimatedReadyAt: order.estimatedReadyAt || new Date(),
    };
  }
}
