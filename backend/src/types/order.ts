import { Types } from "mongoose";
export interface IVariant {
  category: string;
  option: string;
  price: number;
}

export interface IOrderItem {
  itemId: Types.ObjectId;
  itemName: string;
  categoryId?: Types.ObjectId;
  price: number;
  quantity: number;
  itemImages:string[];
  assignedCookId?: Types.ObjectId | null;
  instraction?:string|null;
  variant?: IVariant | null;
  itemStatus: "PENDING" | "PREPARING" | "READY" |"ASSIGNED";
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


// Each item assigned to a chef
export interface AssignedItem {
  orderId: string;
  item: {
    itemId: string;
    itemName: string;
    itemStatus: "ASSIGNED" | "PREPARING" | "READY"|"PENDING";
    quantity: number;
    price: number;
    station?: string;
    variant?: IVariant|null;
    instruction?: string | null;
    assignedCookId?: string;
    itemImages?: string[];
  };
  tableNumber?: string;
  orderStatus: string;
}

// Response type
export interface AssignedItemsResponse {
  success: boolean;
  data: AssignedItem[];
}


