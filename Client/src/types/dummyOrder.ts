// src/types/order.ts

export type ItemStatus = 'PENDING' | 'PREPARING' | 'READY';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  status: ItemStatus;
  preparedBy?: string;
  station?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  orderTime: string;
}
