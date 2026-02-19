import { apiRequest } from "../api/apiRequest";
import type { ItemStatus } from "../types/dummyOrder";
import type { AssignedItemsResponse, IUserOrder } from "../types/order";
import type {
  AddStaffResponse,
  IStaffAdd,
  StaffListResponse,
  StaffResponseDTO,
} from "../types/staffTypes";
import type { IVarientItemType } from "../types/varient";

export const addStaff = async (
  staffData: IStaffAdd,
): Promise<AddStaffResponse> => {
  return apiRequest("POST", `/admin/staff`, staffData);
};

export const getAllStaff = async (
  restaurantId: string,
  page?: number,
  limit?: number,
  searchQuery?: string,
): Promise<StaffListResponse> => {
  let url = `/admin/staff/${restaurantId}?page=${page}&limit=${limit}`;
  if (searchQuery) {
    url += `&search=${encodeURIComponent(searchQuery)}`;
  }
  return apiRequest("GET", url);
};

export const deleteStaff = async (
  staffId: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("DELETE", `/admin/staff/${staffId}`);
};

export const editStaff = async (
  staffId: string,
  updatedData: IStaffAdd,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("PUT", `/admin/staff/${staffId}`, updatedData);
};

export const changeStaffStatus = async (
  staffId: string,
  status: boolean,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("PATCH", `/admin/staff/${staffId}`, { status });
};

export const getTotalOrders = async (
  restaurantId: string,
  status?: string,
): Promise<{ success: boolean; data: IUserOrder[] }> => {
  return apiRequest("GET", `/staff/getOrders/${restaurantId}`);
};

export const updateOrder = async (
  orderId: string,
  itemId: string,
  status: ItemStatus,
  variant?: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("PATCH", `/staff/update-item`, {
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
    "PATCH",
    `/staff/orders/${orderId}/item/${itemId}/assign-cheff`,
    { chefId: chefId, varient: variant },
  );
};

export const getAssignedItems = (
  restaurentId: string,
  chefId: string,
): Promise<AssignedItemsResponse> => {
  return apiRequest("GET", `/staff/getAssignedItems/${restaurentId}/${chefId}`);
};

export const assignOrder = (
  orderId: string,
  staffId: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("PATCH", `/staff/assignOrder/${orderId}`, {
    staffId: staffId,
  });
};

export const changeOrderStatus = (
  orderId: string,
  status: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("PATCH", `/staff/order/updatestatus/${orderId}`, {
    status: status,
  });
};

export const getStaff = (
  staffId: string,
): Promise<{ success: boolean; data: StaffResponseDTO }> => {
  return apiRequest("GET", `/staff/getstaff/${staffId}`);
};

export const changeStaffPassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> => {
   return apiRequest("PATCH", `/staff/change-password`, {
    oldPassword,
    newPassword,
  });
};
