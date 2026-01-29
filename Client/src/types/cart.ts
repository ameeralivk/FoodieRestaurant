

export interface VariantValue {
  _id?: string;
  option?: string;
  price?: number;
}

export interface Variant {
  category?: string;
  option?:string;
  price?:number;
  values?: VariantValue[];
}

export interface CartItem {
  _id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  varient:Variant;
  images: string[];
  instruction?:string;
  variant:Variant
  preparationTime: number;
}

export interface ResponseCart{
    success:boolean,
    cart:Cart
}

export interface Cart {
  _id: string;
  userId: string;
  restaurantId: string;
  tableId: string;
  items: CartItem[];
  totalAmount: number;
  isDeleted: boolean;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
  __v: number;
}
