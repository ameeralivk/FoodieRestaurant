import { apiRequest } from "../api/apiRequest";
import type { SubscriptionPlan } from "../types/SuperAdmin";
import type { CheckPlanResponse } from "../types/PlanTypes";
import type { CreatePlanResponse } from "../types/PlanTypes";
import type { GetAllPlanResponse } from "../types/PlanTypes";
export const createPlan = (
  Data: SubscriptionPlan
): Promise<CreatePlanResponse> => {
  return apiRequest("POST", "/superadmin/plan", Data);
};

export const getAllPlan = async (
  page?: number,
  limit?: number
): Promise<GetAllPlanResponse> => {
  const res = await apiRequest<GetAllPlanResponse>(
    "GET",
    `/superadmin/plan?page=${page}&limit=${limit}`
  );
  return res;
};

export const editPlan = async (
  id: string,
  data: SubscriptionPlan
): Promise<{ success: boolean; message: string }> => {
  const res = await apiRequest<{ success: boolean; message: string }>(
    "PUT",
    `/superadmin/plan/${id}`,
    data
  );
  return res;
};

export const deletePlan = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await apiRequest<{ success: boolean; message: string }>(
    "DELETE",
    `/superadmin/plan/${id}`
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
  }>("POST", "/admin/create-payment", {
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
  return apiRequest("GET", `/admin/payment/session/${sessionId}`);
};

export const getActivePlanByRestaurant = async (
  restaurantId: string
): Promise<CheckPlanResponse> => {
  return apiRequest("GET", `/admin/getplan/${restaurantId}`);
};
