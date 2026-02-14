export type OrderItemStatus = "PENDING" | "PREPARING" | "READY";

export interface IOrderItem {
  _id?:string;
  itemId: string;
  itemName: string;
  price: number;
  itemImages: string[];
  quantity: number;
  instraction?:string;
  variant?: { category: string,option:string,price:number};
  assignedCookId: string | null;
  itemStatus: OrderItemStatus;
}
export type OrderStatus =
    "PREPARING"
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
