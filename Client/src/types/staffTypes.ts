export interface IStaffAdd {
  restaurantId: string;
  staffName: string;
  email: string;
  role: "staff" | "chef";
}

interface IAddStaff {
  success: boolean;
  message: string;
}

export interface Staff {
  _id: string;
  restaurantId: string;
  staffName: string;
  email: string;
  role: "staff" | "chef";
  status: boolean;
  isBlocked: boolean;
  createdAt: string; 
  updatedAt: string; 
};

export interface AddStaffResponse {
  success: boolean;
  message:string;
  data: IAddStaff;
}

export interface StaffListResponse {
  success: boolean;
  data: Staff[];
  total?: number;
}
type ItemStatus = "assigned" | "preparing" | "ready";
export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  station?: string;
  itemStatus: ItemStatus;
  instruction?: string | null;
  variant?: string | null;
}

export interface MyItem {
  orderId: string;
  item: OrderItem;
}

