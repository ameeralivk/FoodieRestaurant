import { BaseRepository } from "../../IBaseRepository";
import { IOrderRepo } from "../interface/interface";
import { IOrderItem, IUserOrderDocument } from "../../../types/order";
import UserOrder from "../../../models/order";
import { ICart } from "../../../types/cart";
import { Types } from "mongoose";
import { AppError } from "../../../utils/Error";
import unwrapVariant from "../../../helpers/unwrapter";
import varient from "../../../models/varient";
export class OrderRepository
  extends BaseRepository<IUserOrderDocument>
  implements IOrderRepo
{
  constructor() {
    super(UserOrder);
  }

  async addOrder(data: ICart, orderId: string): Promise<IUserOrderDocument> {
    try {
      const orderItems = data.items.map((item) => ({
        itemId: item.itemId,
        itemName: item.name,
        itemImages: item.images,
        price: item.price,
        quantity: item.quantity,
        assignedCookId: null,
        variant: unwrapVariant(item.variant),
        itemStatus: "PENDING" as const,
        instraction:item.instraction,
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


  async getEntireOrdersByStatus(status:"PENDING"|"PREPARING"|"READY",restaurantId:string): Promise<IUserOrderDocument[] | null|any> {
       if(!status){
        return await this.model.find({restaurantId:restaurantId})
       }
       return await this.model.find({orderStatus:status,restaurantId:restaurantId})
  }


  async updateItem(orderId: string, itemId: string, status: "PENDING" | "PREPARING" | "READY"): Promise<IUserOrderDocument[] | null> {
     return await this.model.findOneAndUpdate(
    {
      orderId: orderId,
      "items.itemId": itemId,
    },
    {
      $set: {
        "items.$.itemStatus": status,
      },
    },
    { new: true }
  );
  }
}
