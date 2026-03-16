import { apiRequest } from "../api/apiRequest";
import type { SubscriptionPlan } from "../types/SuperAdmin";
import type { CheckPlanResponse } from "../types/PlanTypes";
import type { CreatePlanResponse } from "../types/PlanTypes";
import type { GetAllPlanResponse } from "../types/PlanTypes";
import { HTTP_METHOD } from "../constants/httpMethods";
import { API_ROUTES } from "../constants/ApiRoutes";
export const createPlan = (
  Data: SubscriptionPlan
): Promise<CreatePlanResponse> => {
  return apiRequest("POST",API_ROUTES.PLAN.CREATE, Data);
};

export const getAllPlan = async (
  page?: number,
  limit?: number
): Promise<GetAllPlanResponse> => {
  const res = await apiRequest<GetAllPlanResponse>(
    HTTP_METHOD.GET,
    API_ROUTES.PLAN.GET_ALL(page, limit)
  );
  return res;
};

export const editPlan = async (
  id: string,
  data: SubscriptionPlan
): Promise<{ success: boolean; message: string }> => {
  const res = await apiRequest<{ success: boolean; message: string }>(
    HTTP_METHOD.PUT,
    API_ROUTES.PLAN.EDIT(id),
    data
  );
  return res;
};

export const deletePlan = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await apiRequest<{ success: boolean; message: string }>(
    HTTP_METHOD.DELETE,
    API_ROUTES.PLAN.DELETE(id)
  );
  return res;
};

export const makePayment = async (
  amount: number | null,
  restaurentId: string,
  planId: string | null,
  planName: string
): Promise<{ success: boolean; data: { url: string } }> => {
  const res = await apiRequest<{
    success: boolean;
    data: { url: string };
  }>(HTTP_METHOD.POST,  API_ROUTES.SUBSCRIPTION.CREATE_PAYMENT, {
    amount,
    restaurentId,
    planId,
    planName,
  });
  return res;
};

export const getPaymentBySession = async (
  sessionId: string
): Promise<{ success: boolean; data: any }> => {
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.SUBSCRIPTION.PAYMENT_SESSION(sessionId));
};

export const getActivePlanByRestaurant = async (
  restaurantId: string
): Promise<CheckPlanResponse> => {
  return apiRequest(HTTP_METHOD.GET,API_ROUTES.SUBSCRIPTION.GET_ACTIVE_PLAN(restaurantId));
};

export const upgradeSubscription = async (
  restaurantId: string,
  newPlanId: string
): Promise<{ success: boolean; message: string; url?: string }> => {
  return apiRequest(HTTP_METHOD.POST,API_ROUTES.SUBSCRIPTION.UPGRADE, { restaurantId, newPlanId });
};
