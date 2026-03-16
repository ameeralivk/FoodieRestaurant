import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { ItemStatus } from "../types/dummyOrder";
import type { AssignedItemsResponse, IUserOrder } from "../types/order";
import type {
  AddStaffResponse,
  IStaffAdd,
  StaffListResponse,
  StaffResponseDTO,
} from "../types/staffTypes";

export const addStaff = async (
  staffData: IStaffAdd,
): Promise<AddStaffResponse> => {
  return apiRequest(HTTP_METHOD.POST, API_ROUTES.ADMIN_STAFF.ADD, staffData);
};

// export const getAllStaff = async (
//   restaurantId: string,
//   page?: number,
//   limit?: number,
//   searchQuery?: string,
// ): Promise<StaffListResponse> => {
//   let url = `/admin/staff/${restaurantId}?page=${page}&limit=${limit}`;
//   if (searchQuery) {
//     url += `&search=${encodeURIComponent(searchQuery)}`;
//   }
//   return apiRequest(HTTP_METHOD.GET, url);
// };

export const getAllStaff = async (
  restaurantId: string,
  page?: number,
  limit?: number,
  searchQuery?: string
): Promise<StaffListResponse> => {
  return apiRequest(
    HTTP_METHOD.GET,
    API_ROUTES.ADMIN_STAFF.GET_ALL(restaurantId, page, limit, searchQuery)
  );
};


export const deleteStaff = async (
  staffId: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.DELETE,API_ROUTES.ADMIN_STAFF.DELETE(staffId));
};

export const editStaff = async (
  staffId: string,
  updatedData: IStaffAdd,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PUT,API_ROUTES.ADMIN_STAFF.EDIT(staffId), updatedData);
};

export const changeStaffStatus = async (
  staffId: string,
  status: boolean,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH, API_ROUTES.ADMIN_STAFF.CHANGE_STATUS(staffId), { status });
};

export const getTotalOrders = async (
  restaurantId: string,
): Promise<{ success: boolean; data: IUserOrder[] }> => {
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.STAFF_OPERATIONS.GET_TOTAL_ORDERS(restaurantId));
};

export const updateOrder = async (
  orderId: string,
  itemId: string,
  status: ItemStatus,
  variant?: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH, API_ROUTES.STAFF_OPERATIONS.UPDATE_ITEM_STATUS, {
    orderId,
    itemId,
    status,
    variant,
  });
};

export const assignChefToItem = (
  orderId: string,
  itemId: string,
  chefId: string,
  variant: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(
    HTTP_METHOD.PATCH,
     API_ROUTES.STAFF_OPERATIONS.ASSIGN_CHEF(orderId, itemId),
    { chefId: chefId, varient: variant },
  );
};

export const getAssignedItems = (
  restaurentId: string,
  chefId: string,
): Promise<AssignedItemsResponse> => {
  return apiRequest(
    HTTP_METHOD.GET,
    API_ROUTES.STAFF_OPERATIONS.GET_ASSIGNED_ITEMS(restaurentId, chefId),
  );
};

export const assignOrder = (
  orderId: string,
  staffId: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH,API_ROUTES.STAFF_OPERATIONS.ASSIGN_ORDER(orderId), {
    staffId: staffId,
  });
};

export const changeOrderStatus = (
  orderId: string,
  status: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH,API_ROUTES.STAFF_OPERATIONS.CHANGE_ORDER_STATUS(orderId), {
    status: status,
  });
};

export const getStaff = (
  staffId: string,
): Promise<{ success: boolean; data: StaffResponseDTO }> => {
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.STAFF_OPERATIONS.GET_STAFF(staffId));
};

export const changeStaffPassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.PATCH,API_ROUTES.STAFF_OPERATIONS.CHANGE_PASSWORD, {
    oldPassword,
    newPassword,
  });
};
