import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { GetMenuItemsResponse } from "../types/Items";
import type { GetUsersResponse } from "../types/userTypes";
export const getUsers = async (
  currentPage: number,
  limit: number,
  searchTerm: string,
): Promise<{
  success: boolean;
  users: any;
  message: string;
  data: GetUsersResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  return apiRequest(
    HTTP_METHOD.GET,
    API_ROUTES.SUPERADMIN_USER.GET_ALL(currentPage, limit, searchTerm),
  );
};

export const changeUserStatus = async (
  userId: string,
  status: boolean,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(
    HTTP_METHOD.PATCH,
    API_ROUTES.SUPERADMIN_USER.CHANGE_STATUS(userId),
    { status },
  );
};

export const getItem = async (id: string): Promise<GetMenuItemsResponse> => {
  return apiRequest(HTTP_METHOD.GET, API_ROUTES.ADMIN_ITEMS.GET_ONE(id));
};

export const sendToAi = async (
  prompt: string,
  restaurantId?: string,
): Promise<{ reply: string }> => {
  return apiRequest(HTTP_METHOD.POST, API_ROUTES.AI.ASK, {
    prompt,
    restaurantId,
  });
};

export const checkTable = async (
  restaurantId: string,
  tableNo: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.POST, API_ROUTES.TABLE.CHECK, {
    restaurantId,
    tableNo,
  });
};
