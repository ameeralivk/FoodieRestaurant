import type { ICart } from "../../../types/cart";
import { CartVariant } from "../../../types/cart";
export interface ICartService {
  addToCart(
    userId: string,
    itemId: string,
    restaurantId: string,
    tableId: string,
    quantity: string,
    variant: CartVariant,
  ): Promise<ICart | null>;
  updateQuantity(
    cartId: string,
    restaurantId: string,
    itemId: string,
    action: "inc" | "dec",
    variant: CartVariant | undefined,
  ): Promise<{ success: boolean; message: string }>;
  getCart(userId: string, restaurantId: string): Promise<ICart | null>;
  deleteCart(
    cartId: string,
    restaurantId: string,
    itemId: string,
    variant: CartVariant,
  ): Promise<{ success: boolean; message: string }>;
  updateCartItemInstruction(cartId: string , cartItemId: string,instruction:string,variant?:{category:string,option:string,price:number}):Promise<{success:boolean,message:string}>
}
