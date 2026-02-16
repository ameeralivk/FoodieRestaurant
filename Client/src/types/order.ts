import type { IVarientItemType } from "./varient";

export type OrderItemStatus = "PENDING" | "PREPARING" | "READY"|"ASSIGNED";

export interface IOrderItem {
  _id?:string;
  itemId: string;
  itemName: string;
  price: number;
  itemImages: string[];
  quantity: number;
  instraction?:string;
  variant?: {_id:string, category: string,option:string,price:number};
  assignedCookId: string | null;
  createdAt?:string;
  itemStatus: OrderItemStatus;
}
// export type OrderStatus =
//     "ASSIGNED"
//     "PREPARING"
//   | "PLACED"
//   | "IN_KITCHEN"
//   | "READY"
//   | "SERVED"
//   | "FAILED";

export type OrderStatus =
  | "ASSIGNED"
  | "PREPARING"
  | "PLACED"
  | "IN_KITCHEN"
  | "READY"
  | "SERVED"
  | "FAILED";


export interface IUserOrder {
  _id: string;
  restaurantId: string;
  userId: string;
  tableId: string;
  orderId: string;
  items: IOrderItem[];

  subTotal: number;
  totalAmount: number;
  currency: "INR";

  orderStatus: OrderStatus;

  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}
export interface IPaginatedOrdersResponse {
  success: boolean;
  data: IUserOrder[];
  total: number;
  page: number;
  limit: number;
}

export interface IOrder {
  _id: string;
  orderId: string;
  userId: string;
  restaurantId: string;
  tableId: string;
  currency: "INR";
  items: IOrderItem[];
  subTotal: number;
  totalAmount: number;
  orderStatus:
      "ASSIGNED"
    | "PLACED"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "COMPLETED"
    | "CANCELLED";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface IGetOrderResponse {
  success: boolean;
  result: IOrder;
}

export interface AssignedItem {
  orderId: string;
  item: {
    itemId: string;
    itemName: string;
    itemStatus: "ASSIGNED" | "PREPARING" | "READY"|"PENDING";
    quantity: number;
    price: number;
    assignedCookId: string;
    itemImages: string[];
    variant?: IVarientItemType;
    instruction?: string | null;
  };
  tableNumber: string;
  orderStatus: "ASSIGNED" | "PREPARING" | "READY" | "PLACED" | "SERVED" | "CANCELLED";
}

export interface AssignItem {
    itemId: string;
    itemName: string;
    itemStatus: "ASSIGNED" | "PREPARING" | "READY"|"PENDING";
    quantity: number;
    price: number;
    assignedCookId: string;
    itemImages: string[];
    variant?: IVarientItemType;
    instruction?: string | null;
}

export interface AssignedItemsResponse {
  success: boolean;
  data: AssignedItem[];
}

