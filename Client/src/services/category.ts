import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { CategoryResponse } from "../types/category";

export const getAllCategory = async (
  restaurantId: string,
  page?: number,
  limit?: number,
  search?: string
): Promise<CategoryResponse> => {
  return apiRequest(
    HTTP_METHOD.GET,
    API_ROUTES.CATEGORY.GET_ALL(restaurantId, page, limit, search)
  );
};

export const addCategory = async (
  name: string,
  description: string,
  restuarantId: string | undefined
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.POST,API_ROUTES.CATEGORY.ADD, {
    name,
    description,
    restaurantId: restuarantId,
  });
};

export const deleteCategory = async (
  restaurantId: string | undefined,
  categoryId: string
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.DELETE,API_ROUTES.CATEGORY.DELETE(restaurantId!, categoryId));
};

export const editCategory = async (
  restaurantId: string | undefined,
  categoryId: string,
  data: { name: string; description: string }
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(
    HTTP_METHOD.PATCH,
    API_ROUTES.CATEGORY.EDIT(restaurantId!, categoryId),
    data
  );
};
