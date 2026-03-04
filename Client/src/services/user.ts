import { apiRequest } from "../api/apiRequest";
import type { GetMenuItemsResponse } from "../types/Items";
import type { GetUsersResponse } from "../types/userTypes";
export const getUsers = async (
  currentPage: number,
  limit: number,
  searchTerm: string
): Promise<{
  success: boolean;
  message: string;
  data: GetUsersResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  return apiRequest(
    "GET",
    `/superadmin/user?page=${currentPage}&limit=${limit}&search=${searchTerm}`
  );
};

export const changeUserStatus = async (
  userId: string,
  status: boolean
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("PATCH", `/superadmin/user/${userId}/status`, { status });
};

export const getItem = async (id: string): Promise<GetMenuItemsResponse> => {
  return apiRequest("GET", `/admin/items/${id}`);
};

export const sendToAi = async (prompt: string): Promise<{ reply: string }> => {
  return apiRequest("POST", `/user/ai`, { prompt });
};

export const checkTable = async(restaurantId:string,tableNo:string):Promise<{success:boolean,message:string}>=>{
  return apiRequest("POST",`/user/check-table`,{restaurantId, tableNo})
}
