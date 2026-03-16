import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { CartItem } from "../types/cart";
import type { IGetOrderResponse, IPaginatedOrdersResponse} from "../types/order";
export const orderPayment = async (
  amount: number,
  restaurantId: string,
  userId: string,
  items: CartItem[]
): Promise<{ success: boolean; data: { url: string } }> => {
  return apiRequest(HTTP_METHOD.POST,API_ROUTES.ORDERS.PAYMENT, {
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
    HTTP_METHOD.GET,
    API_ROUTES.ORDERS.GET_ALL(userId, page, limit, search)
  );
};

export const getOrder = async (
  orderId: string
): Promise<IGetOrderResponse> => {
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.ORDERS.GET_ONE(orderId));
};


export const cancellOrder = async(
  orderId:string,
  userId:string
):Promise<{success:boolean,message:string}>=>{
  return apiRequest(HTTP_METHOD.POST, API_ROUTES.ORDERS.CANCEL(orderId),{userId})
}


export const getOrderEstimate = async (
  orderId: string
): Promise<{ estimatedPrepTime: number; estimatedReadyAt: string }> => {
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.ORDERS.ESTIMATE(orderId));
};

