import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { SubCategoryResponse } from "../types/subCategory";

export const getAllSubCategory = async (
  restaurantId: string,
  page: number,
  limit: number,
  search: string
): Promise<SubCategoryResponse> => {
  return apiRequest(
    HTTP_METHOD.GET,
    API_ROUTES.SUBCATEGORY.GET_ALL(restaurantId, page, limit, search)
  );
};

export const addSubCategory = async (data: {
  name: string;
  description: string;
  restaurantId?: string;
  categoryId?: string;
}): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.POST,API_ROUTES.SUBCATEGORY.ADD, data);
};

export const deleteSubCategory = async (
  subcategoryId: string
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.DELETE,API_ROUTES.SUBCATEGORY.DELETE(subcategoryId));
};

export const editSubCategory = async (
  subcategoryId: string,
  data: {
    name: string;
    description: string;
    restaurantId?: string;
    categoryId?: string;
  }
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH,API_ROUTES.SUBCATEGORY.EDIT(subcategoryId), data);
};
