import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { ITable, ITableForm } from "../types/tableTypes";

export const addTable = async (
  tableData: ITableForm
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.POST,API_ROUTES.ADMIN_TABLE.ADD, tableData);
};

export const editTable = async (
  tableData: ITableForm,
  tableId: string
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PUT, API_ROUTES.ADMIN_TABLE.EDIT(tableId), tableData);
};

export const getTables = async (
  restaurantId: string,
  currentPage: number,
  limit: number,
  searchTerm: string
): Promise<{
  success: boolean;
  message: string;
  data: ITable[];
  total: number;
  page: number;
  limit: number;
}> => {
  return apiRequest(
    HTTP_METHOD.GET,
     API_ROUTES.ADMIN_TABLE.GET_ALL(
      restaurantId,
      currentPage,
      limit,
      searchTerm
    )
  );
};

export const changeTableAvailability = async (
  isAvailable: boolean,
  tableId: string
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH,API_ROUTES.ADMIN_TABLE.CHANGE_AVAILABILITY(tableId), {isAvailable});
};

export const deleteTable = async (
  tableId: string
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.DELETE,API_ROUTES.ADMIN_TABLE.DELETE(tableId));
};