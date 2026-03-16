import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { IItemResponse } from "../types/Items";

export const getAllItems = async (
  restaurantId: string,
  page: number,
  limit: number,
  search: string
): Promise<IItemResponse> => {
  return apiRequest(
    HTTP_METHOD.GET,
    API_ROUTES.ITEMS.GET_ALL(restaurantId, page, limit, search)
  );
};

export const addItems = async (
  data: FormData
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.POST, API_ROUTES.ITEMS.ADD, data);
};

export const deleteItem = async (
  itemId: string
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.DELETE,API_ROUTES.ITEMS.DELETE(itemId));
};

export const editItem = async (
  ItemId: string,
  data: FormData
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH, `/admin/items/${ItemId}`, data);
};

export const changeItemStatus = async (
  itemId: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH, API_ROUTES.ITEMS.CHANGE_STATUS(itemId), { isActive });
};

export const getAllMenuItems = async (
  restaurantId: string
): Promise<IItemResponse> => {
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.ITEMS.GET_MENU_ITEMS(restaurantId));
};
