import { BaseRepository } from "../../BaseRepository";
import { IOrderRepo } from "../interface/interface";
import { IUserOrderDocument } from "../../../types/order";
import UserOrder from "../../../models/order";
import { ICart } from "../../../types/cart";
import { FilterQuery } from "mongoose";
import { Types } from "mongoose";
import { AppError } from "../../../utils/Error";
import unwrapVariant from "../../../helpers/unwrapter";
export class OrderRepository
  extends BaseRepository<IUserOrderDocument>
  implements IOrderRepo
{
  constructor() {
    super(UserOrder);
  }

  async addOrder(
    data: ICart,
    orderId: string,
    estimatedPrepTime?: number,
    estimatedReadyAt?: Date,
  ): Promise<IUserOrderDocument> {
    try {
      const orderItems = data.items.map((item) => ({
        itemId: item.itemId,
        itemName: item.name,
        itemImages: item.images,
        price: item.price,
        quantity: item.quantity,
        assignedCookId: null,
        preparationTime: item.preparationTime ? item.preparationTime : null,
        variant: unwrapVariant(item.variant) ?? null,
        itemStatus: "PENDING" as const,
        instraction: item.instraction,
      }));

      let res = await this.create({
        userId: data.userId,
        restaurantId: data.restaurantId,
        tableId: String(data.tableId),
        items: orderItems,
        subTotal: data.totalAmount,
        totalAmount: data.totalAmount,
        currency: "INR",
        orderId,
        orderStatus: "PLACED",
        estimatedPrepTime: estimatedPrepTime || 0,
        estimatedReadyAt: estimatedReadyAt || undefined,
      });
      return res;
    } catch (error: any) {
      console.log(error);
      throw new AppError(error.message);
    }
  }

  async getAllOrders(
    userId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{ data: IUserOrderDocument[]; total: number }> {
    const filter: any = {
      userId,
    };

    if (search) {
      filter.$or = [
        { tableId: { $regex: search, $options: "i" } },
        { orderStatus: { $regex: search, $options: "i" } },
      ];
    }

    return await this.getAll(filter, { page, limit });
  }

  async getOrder(orderId: string): Promise<IUserOrderDocument | null> {
    const order = await this.getByFilter({
      orderId: orderId,
    });
    return order;
  }
  async getOrderById(orderId: string): Promise<IUserOrderDocument | null> {
    const order = await this.getByFilter({
      _id: new Types.ObjectId(orderId),
    });
    return order;
  }
  changeStatus(
    orderId: string,
    status: string,
  ): Promise<IUserOrderDocument | null> {
    return this.findByIdAndUpdate(orderId, { orderStatus: status });
  }

  async getEntireOrdersByStatus(
    status: "PENDING" | "PREPARING" | "READY",
    restaurantId: string,
  ): Promise<IUserOrderDocument[] | null | any> {
    if (!status) {
      return await this.model.find({ restaurantId: restaurantId });
    }
    return await this.model.find({
      orderStatus: status,
      restaurantId: restaurantId,
    });
  }

  async updateItem(
    orderId: string,
    itemId: string,
    status: "PENDING" | "PREPARING" | "READY",
    variantId?: string,
  ): Promise<IUserOrderDocument[] | null> {
    const query: FilterQuery<IUserOrderDocument> = {
      orderId,
      items: {
        $elemMatch: variantId
          ? {
              itemId: new Types.ObjectId(itemId),
              "variant._id": new Types.ObjectId(variantId),
            }
          : {
              itemId: new Types.ObjectId(itemId),
            },
      },
    };

    return await this.model.findOneAndUpdate(
      query,
      {
        $set: {
          "items.$.itemStatus": status,
        },
      },
      { new: true },
    );
  }

  async assignChefToItem(
    orderId: string,
    itemId: string,
    chefId: string,
    variantId?: string,
  ): Promise<IUserOrderDocument | null> {
    const query: FilterQuery<IUserOrderDocument> = {
      orderId,
      items: {
        $elemMatch: variantId
          ? {
              itemId: new Types.ObjectId(itemId),
              "variant._id": new Types.ObjectId(variantId),
            }
          : {
              itemId: new Types.ObjectId(itemId),
            },
      },
    };

    return await this.model.findOneAndUpdate(
      query,
      {
        $set: {
          "items.$.assignedCookId": new Types.ObjectId(chefId),
          "items.$.itemStatus": "ASSIGNED",
        },
      },
      { new: true },
    );
  }

  async getAssignedItems(
    restaurantId: string,
  ): Promise<IUserOrderDocument[] | null> {
    return await this.model.find({ restaurantId: restaurantId });
  }

  async assignOrder(
    orderId: string,
    staffId: string,
  ): Promise<IUserOrderDocument | null> {
    return await this.model.findOneAndUpdate(
      { orderId: orderId },
      {
        $set: {
          assignedByStaffId: new Types.ObjectId(staffId),
          orderStatus: "ASSIGNED",
        },
      },
      { new: true },
    );
  }

  async updateOrder(
    orderId: string,
    status: string,
  ): Promise<IUserOrderDocument | null> {
    return await this.model.findOneAndUpdate(
      { orderId: orderId },
      { orderStatus: status },
    );
  }

  async totalCount(restaurantId: string): Promise<number> {
    const date = new Date();
    return await this.model.countDocuments({
      restaurantId,
      createdAt: date,
      orderStatus: { $in: ["PLACED", "PREPARING", "ASSIGNED"] },
    });
  }

  // async activeOrders(restaurantId: string): Promise<IUserOrderDocument[]> {
  //   const date = new Date();
  //   return await this.model.find({
  //     restaurantId,
  //     createdAt: date,
  //     orderStatus: { $in: ["PLACED", "PREPARING", "ASSIGNED"] },
  //   });
  // }

  async activeOrders(restaurantId: string): Promise<IUserOrderDocument[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await this.model.find({
      restaurantId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      orderStatus: { $in: ["PLACED", "PREPARING", "ASSIGNED"] },
    });
  }
}
