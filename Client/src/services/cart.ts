import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
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
  return apiRequest(HTTP_METHOD.POST, API_ROUTES.CART.ADD, {
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
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.CART.GET(userId, restaurantId));
};

export const CartUpdate = (
  cartId: string,
  restaurantId: string,
  itemId: string,
  action: "inc" | "dec",
  variant?: Variant | null,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PUT, API_ROUTES.CART.UPDATE_QUANTITY, {
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
  return apiRequest(HTTP_METHOD.DELETE,API_ROUTES.CART.DELETE(cartId, restaurantId), {
    itemId,
    variant,
  });
};

export const addInstruction = (
  cartId: string,
  cartItemId: string,
  instruction: string,
  variant: Variant | null,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH, API_ROUTES.INSTRUCTION.ADD, {
    cartId,
    cartItemId,
    instruction,
    variant,
  });
};
