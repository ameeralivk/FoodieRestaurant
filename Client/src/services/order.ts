import { apiRequest } from "../api/apiRequest";
import type { CartItem } from "../types/cart";
import type { IGetOrderResponse, IPaginatedOrdersResponse, IUserOrder } from "../types/order";
export const orderPayment = async (
  amount: number,
  restaurantId: string,
  userId: string,
  items: CartItem[]
): Promise<{ success: boolean; data: { url: string } }> => {
  return apiRequest("POST", `/user/order/payment`, {
    amount,
    restaurantId,
    userId,
    items,
  });
};

export const getAllOrders = async (
  userId: string,
  page: number,
  limit: number,
  search?: string
): Promise<IPaginatedOrdersResponse> => {
  return apiRequest(
    "GET",
    `/user/orders?userId=${userId}&page=${page}&limit=${limit}&search=${
      search || ""
    }`
  );
};

export const getOrder = async (
  orderId: string
): Promise<IGetOrderResponse> => {
  return apiRequest("GET", `/user/orders/${orderId}`);
};


export const cancellOrder = async(
  orderId:string,
  userId:string
):Promise<{success:boolean,message:string}>=>{
  return apiRequest("POST",`/user/orders/${orderId}/cancell`,{userId})
}
