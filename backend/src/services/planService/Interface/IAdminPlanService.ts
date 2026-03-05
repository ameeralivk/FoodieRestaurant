import { ISubscriptionPlan } from "../../../types/plan";
import { ISubscriptionPlanDTO } from "../../../utils/dto/subscriptionPlanDto";

export interface IAdminPlanService {
  addPlan(
    PlanData: ISubscriptionPlan
  ): Promise<{ success: boolean; message: string }>;
  getAllPlan(
    page?: number,
    limit?: number
  ): Promise<{ success: boolean; data: ISubscriptionPlanDTO[];total: number;}>;
  editPlan(
    id: string,
    newData: ISubscriptionPlan
  ): Promise<{ success: boolean; message: string }>;
  deletePlan(id: string): Promise<{ success: boolean; message: string }>;
}
