import { apiRequest } from "../api/apiRequest";
import type { ResponseCart } from "../types/cart";
import type { Variant } from "../types/Items";

export const AddToCart = (
  userId: string,
  restaurantId: string,
  itemId: string,
  tableId: string,
  quantity: string,
  variant?: { category: string; option: string; price: number },
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("POST", "/user/cart", {
    userId,
    restaurantId,
    itemId,
    tableId,
    quantity,
    variant,
  });
};

export const getCart = (
  userId: string,
  restaurantId: string,
): Promise<ResponseCart> => {
  return apiRequest("GET", `/user/cart/${userId}/${restaurantId}`);
};

export const CartUpdate = (
  cartId: string,
  restaurantId: string,
  itemId: string,
  action: "inc" | "dec",
  variant?: Variant | null,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("PUT", "/user/cart/update-quantity", {
    cartId,
    restaurantId,
    itemId,
    action,
    variant,
  });
};

export const deleteCart = (
  cartId: string,
  restaurantId: string,
  itemId: string,
  variant: Variant | undefined,
): Promise<ResponseCart> => {
  return apiRequest("DELETE", `/user/cart/${cartId}/${restaurantId}`, {
    itemId,
    variant,
  });
};

export const addInstruction = (
  cartId: string,
  cartItemId: string,
  instruction: string,
  variant:Variant|null
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("PATCH", `/user/instruction`, {
    cartId,
    cartItemId,
    instruction,
    variant
  });
};
