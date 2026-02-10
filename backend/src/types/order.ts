import { Types } from "mongoose";

export interface IOrderItem {
  itemId: Types.ObjectId;
  itemName: string;
  categoryId?: Types.ObjectId;
  price: number;
  quantity: number;
  itemImages:string[];
  assignedCookId?: Types.ObjectId | null;

  itemStatus: "PENDING" | "PREPARING" | "READY";

  assignedAt?: Date;
  preparedAt?: Date;
}


export interface IUserOrder {
  _id?:Types.ObjectId;
  restaurantId: Types.ObjectId;
  tableId: string;

  customerName?: string;
  customerPhone?: string;

  items: IOrderItem[];

  subTotal: number;
  userId:Types.ObjectId;
  totalAmount: number;
  orderId:string;
  currency: "INR";

  orderStatus: "PLACED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";

  assignedByStaffId?: Types.ObjectId;
  status?:string;
  servedAt?: Date;
}

export interface IUserOrderDocument extends IUserOrder, Document {
  createdAt: Date;
  updatedAt: Date;
}

